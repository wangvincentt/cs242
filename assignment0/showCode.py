
#from config import ServerConfig
import threading, socket, time, sys, Queue, random, pickle,os
from datetime import datetime
from time import sleep
from Queue import PriorityQueue

# Using dictionary to store value, helpful for send message 
portDic = {'A': 12346, 'B': 22345, 'C': 32345, 'D': 42345};
nameDic = {12346: 'A', 22345: 'B', 32345: 'C', 42345: 'D'};

cmd_Queue = Queue.Queue()
# Locks for receive method, lock 
msgLock = threading.Lock()
inboxLock = threading.Lock()
timeLock = threading.Lock()
replicaLock = threading.Lock()
cmd_QueueLock = threading.Lock()

def delay (server, data, addr, timeStamp):

	sender = nameDic[addr[1]]
	randDelay = random.randint(1,server.maxDelay)
	time.sleep(randDelay)

	# Lock inboxLock on thread to ensure no racing condition on inbox Queue
	inboxLock.acquire()
	msg = (data.strip(), sender)
	server.inbox.put(msg, timeStamp)
	inboxLock.release()

	# Record receving time and print them out
	recvTime = datetime.now().strftime("%H:%M:%S.%f")
	
	# DO NOT WANT IT TO INTERRUPT INPUT
	# User can uncommend it
	print 'Received ' + '[ ' + data.strip()+ ' ]' +' from [' + str(sender)+'],' + ' Max delay is ' + str(server.maxDelay) + ' s, system time is ' + str(recvTime) 

# This is multi-thread unicast to build multi-thread
def multicast(server,msg,data_string, port,dest):

	host = 'localhost'
	try:	
		sendTime = datetime.now().strftime("%H:%M:%S.%f")
		server.s.sendto(data_string,(host,port))

		#DO NOT WANT IT TO INTERRUPT INPUT
		# USER CAN UNCOMMEND IT
		print 'Sent ' + '[ ' + msg + ' ]' + ' to ' + str(dest) +', system time is ' + str(sendTime)

	except socket.error, msg:
		print 'Error Code : ' + str(msg[0])  + 'Message ' + msg[1]
		sys.exit()

def realTime():
	x = time.time()
	x = int(x%10000)
	return x

# Code of MyPriorityQueue from http://stackoverflow.com/questions/9289614/how-to-put-items-into-priority-queues
class MyPriorityQueue(PriorityQueue):
    def __init__(self):
        PriorityQueue.__init__(self)
        self.counter = 0

    def put(self, item, priority):
        PriorityQueue.put(self, (priority, self.counter, item))
        self.counter += 1

    def get(self, *args, **kwargs):
        _, _, item = PriorityQueue.get(self, *args, **kwargs)
        self.counter -= 1
        return item


class Server:
	#initilize server, create a server node for each processor
	def __init__(self,max_delay,port, name):	
		self.port = port
		self.name = name
		self.addr = ('localhost',port)
		# Using UDP as communication protocol 
		self.s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
		self.s.bind(self.addr)

		self.mesg = Queue.Queue()
		self.dest = Queue.Queue()

		self.inbox =MyPriorityQueue()
		self.replica = dict()
		#self.delay = 0
		self.maxDelay = max_delay
		self.timeStamp = 0
		self.model = -1

		#self.s.listen(5)

	# This is multirecv function for each searver node
	def multirecv(self):
		# receive data from client (data, addr)
		while True:
			data, addr = self.s.recvfrom(4096)
			data_arr = pickle.loads(data)

			if self.model == 2:
				# Lock and unlock in critical region for timeStamp
				timeLock.acquire()
				timeStamp = data_arr[1]
				self.timeStamp = max(int(timeStamp), self.timeStamp) +1
				timeLock.release()

			if not data: 
				self.s.close()

			if self.model == 2:
				timeLock.acquire()
				priority = self.timeStamp
				timeLock.release()
			elif self.model == 1:
				priority = realTime()
			else:
				sys.exit()

			t = threading.Thread(target = delay, args = (self, data_arr[0], addr,priority))
			t.start()
		self.s.close()

	def multisend(self, msg, dest):
		host = 'localhost'

		# This while loop to detect whether receiver is valid, is not, ask user to reenter them
		while True:
			flag = False
			length = 0
			dests = dest.split(',')

			for i in range (0,len(dests)):
				if dests[i] in portDic.keys():
					length = length +1
				else:
					print 'Error destination, please try again'
					flag = True
					break

			if flag == True:
				dest = raw_input('Enter destination. Eg, "A,B,C,D"\n')
			elif length == len(dests):
				break

		# Send command or content to other server as well as timeStamp
		# I use pickle method to dumps array to buff and send it to sender
		timeLock.acquire()
		#msg = raw_input('Enter message to send to server ' + dest+': \n')


		if self.model == 2:
			msgArr = (msg, str(self.timeStamp))
		elif self.model == 1:
			msgArr = (msg, str(realTime()))
		else:
			sys.exit()

		timeLock.release()
		data_string = pickle.dumps(msgArr)
		threads = []
		for i in range(0,len(dests)):
			port = portDic[dests[i]]
			t = threading.Thread(target = multicast, args = (self, msg, pickle.dumps(msgArr), port,dests[i]))
			threads.append(t)
			t.start()

		# Waiting for thread to end
		for i in range (0, len(threads)):
			threads[i].join()

	# This is receive handler to deal with command received into inbox
	def recvHandler(self):
		while True:
			# If there is no command in inbox Queue, 
			# waiting several second to re-check in order to save CPU resource
			inboxLock.acquire()
			if self.inbox.counter > 0:
				#sys.sleep(2)
				command = self.inbox.get()
			else:
				inboxLock.release()
				time.sleep(1)
				continue
			inboxLock.release()

			#print command
			cmd_l = command[0].split()
			
			sender_port = portDic[command[1]]

			# If other servers and for 'search a key', 
			# check replica in the server node and send the respond back

			if cmd_l[0] == 'search' and len(cmd_l) == 2:
				try:
					my_key = int(cmd_l[1])
				except ValueError:
					print 'Invalud ValueError'
					pass
				replicaLock.acquire()
				if my_key in self.replica:
					respond = command[0] + ' YES'
				else:
					respond = command[0] + ' NO'
				replicaLock.release()


				if self.model ==2:
					msgArr = (respond,self.timeStamp)
				elif self.model == 1:
					msgArr = (respond,realTime())
				else:
					sys.exit()

				data_string = pickle.dumps(msgArr)
				self.s.sendto(data_string,('localhost',sender_port))

			# If other servers respond 'search a key'
			# print out the corresponding results
			elif cmd_l[0] == 'search' and len(cmd_l) == 3:
				if cmd_l[2] == 'YES':
					print 'search key ' + cmd_l[1]+ '-YES from '  + str(command[1])
				else:
					print 'search key ' + cmd_l[1]+ '-NO from '  + str(command[1])

			elif cmd_l[0] == 'delete':
				try:
					my_key = int(cmd_l[1])
				except ValueError:
					continue
				self.deleteKey(my_key)

			elif cmd_l[0] == 'insert' or cmd_l[0] == 'update':
				try:
					my_key = int(cmd_l[1])
					my_value = int(cmd_l[2])
				except ValueError:
					continue
				self.insert_update(my_key,my_value)
			elif cmd_l[0] == 'get':
				print 'get '+'[' +cmd_l[1]+']: '+ str(self.getKey(int(cmd_l[1])))
			elif cmd_l[0] == 'show-all':
				self.showAll()
			elif cmd_l[0] == 'print':
				print 'Time Stamp is ' +str(self.timeStamp)

	def getKey(self, my_key):
		replicaLock.acquire()
		ret = None
		try:
			ret = self.replica[my_key]
		except KeyError:
			pass
		replicaLock.release()
		return ret 

	def deleteKey(self, my_key):
		replicaLock.acquire()
		try: 
			del self.replica[my_key]
		except KeyError:
			pass
		replicaLock.release()


	def insert_update(self, my_key, my_value):
		replicaLock.acquire()
		self.replica[my_key] = my_value
		replicaLock.release()

	def showAll(self):
		if len(self.replica) == 0:
			print 'It is Empty'
		else:
			print 'Current Replica is: '
			replicaLock.acquire()
			for key in self.replica.keys() :
				print (key,self.replica[key])
			replicaLock.release()


	#def linerizability(self):

def otherServer(name):
	if name =='A':
		return 'B,C,D'
	elif name == 'B':
		return 'A,C,D'
	elif name == 'C':
		return 'A,B,D'
	else:
		return 'A,B,C'

def readFromFile(name):
	filename = 'server'+name+'.txt'
	f = open(filename,'r')
	
	for line in f:
		cmd_Queue.put(line)
	f.close()

def cmd_input(name):
	while True:
		command = raw_input('Enter your command. ie. "File Input", "quit", "send msg to A,B,C", "delete key", "get key Model", "insert key value model", "update key value model", "show-all", "search key", "delay T"\n' )
		if command == 'quit':
			os._exit(0)
		elif command == 'File Input':
			t1 = threading.Thread(target = readFromFile, args = name)
			t1.start()
			t1.join()
			continue
		cmd_Queue.put(command)


def main ():
	while True:
		#command = raw_input('Enter your command. ie. "send msg to A,B,C", "delete key", "get key Model", "insert key value model", "update key value model", "show-all", "search key", "delay T"\n' )
		try:
			cmd_QueueLock.acquire()
			cmd = cmd_Queue.get()
			cmd_QueueLock.release()
		except:
			sys.sleep(1)
			continue
		

		#print cmd
		# Parse command line from Queue
		cmd_l = cmd.split()
		if cmd_l[0]  == 'send':
			msg = ""
			i = 1
			while i < len(cmd_l):
				if(cmd_l[i+1] == 'to'):
					msg +=cmd_l[i]
					i+=1
					break
				else:
					msg += cmd_l[i] + ' '
				i+=1

			t1 = threading.Thread(target = serverNode.multisend, args = (msg,cmd_l[i+1]))
			t1.start()
			t1.join()

		# elif cmd == 'show-all':
		# 	serverNode.showAll()
		elif cmd_l[0] == 'delay':
			delayTime = float(cmd_l[1])
			sleep(delayTime)
		else: 
			M = -1
			if cmd_l[0] == 'get' or cmd_l[0] == 'insert' or cmd_l[0] == 'update':
				if cmd_l[0] == 'get':
					try:
				 		M = int(cmd_l[2])
				 	except IndexError,ValueError:
				 		print 'Error, input your command again'
				 		continue
				 	# Send the command only to self
				 	#serverNode.multisend(cmd,serverNode.name)
				else:
					try:
						M = int(cmd_l[3])
					except:
						print 'Error, input your command again'
						continue
				if M !=model:
					print('Inconsistency of model, try again')
					continue 
			# Send to command
			if serverNode.model == 2:
				serverNode.timeStamp +=1
			data_s = (cmd,serverNode.name)
			
			inboxLock.acquire()
			if serverNode.model == 1:
				serverNode.inbox.put(data_s,realTime())
			elif serverNode.model == 2:
				serverNode.inbox.put(data_s,serverNode.timeStamp)
			inboxLock.release()

			if cmd_l[0] !='get' and cmd_l[0] !='show-all':
				serverNode.multisend(cmd,otherServer(serverNode.name))
			# elif cmd_l[0] == 'show-all':
			# 	serverNode.multisend(cmd,serverNode.name)


if __name__ == "__main__":

	# Manuly create four server Nodes --  I do not know how to use configure	
	while True:
		client = raw_input('Enter client name. ie. "A", "B", "C", "D"\n'  )

		if(client == 'A'):
			serverNode = Server(4,12346, 'A')
			break
		elif client == 'B':
			serverNode = Server(5,22345, 'B')
			break
		elif client == 'C':
			serverNode = Server(6,32345, 'C')
			break
		elif client == 'D':
			serverNode = Server(7,42345, 'D')
			break
		else:
			print 'Error name, please try again. '
	threads = []

	# Create four thread to receive msg from other server including self
	for i in range (0,4):
		t = threading.Thread(target = serverNode.multirecv)
		t.start()	
		threads.append(t)

	# Create a thread to handler command in inbox Queue
	t = threading.Thread(target = serverNode.recvHandler)
	t.start()
	threads.append(t)

	# Select model, all servers must select same model
	while True:
		input_model = raw_input('Enter your model. 1 for linerizability, 2 for sequential\n')
		try:
			model = int(input_model)
		except ValueError:
			print("ValueError")
			continue
		if(model ==1 or model ==2):
			break

	serverNode.model = model

	# Create threads for command line input as well as main thread
	t = threading.Thread(target = cmd_input, args = serverNode.name)
	# User can input command to let servers do somethings
	threads.append(t)
	t.start()

	t = threading.Thread(target = main)
	threads.append(t)
	t.start()
	
	# Thread join
	for i in range (0, 7):
		threads[i].join()





