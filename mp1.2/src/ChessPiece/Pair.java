package ChessPiece;

/*This is Pair class to record positions in a form of (a,b)
 */
public class Pair {
	private int first, second;
	/*This is the default constructor setting default value of 
	 * both positions to 0
	 */
	public Pair(){
		first = 0;
		second =0;
	}
	public Pair(Pair other){
		first = other.first;
		second =other.second;
	}
	/*This is a constructor with values given*/
	public Pair(int fst, int snd){
		first = fst;
		second = snd;
	}
	
	/*return first*/
	public int getFirst(){
		return first;
	}
	/*return second*/
	public int getSecond(){
		return second;
	}
	/*set both values for the Pair*/
	public void setPair(int fst, int snd){
		first = fst;
		second = snd;
	}
	/*change the first position value for the pair*/
	public void setFirst(int fst){
		first = fst;
	}
	/*change the second position value for the pair*/
	public void setSecond(int snd){
		second = snd;
	}
}
