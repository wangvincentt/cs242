package GameLoop;
import ChessPiece.Piece;
import ChessPiece.Board;
import ChessPiece.Space;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import javax.swing.JFrame;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Game {
	private Board myBoard;
	
	private JPanel boardUI = new JPanel( new GridLayout(0,8) );
	
	private final JPanel boardContainer = new JPanel( new BorderLayout(8,8) );
	
	private JFrame frame;
	
	private String blackPlayer, whitePlayer;
	
	private Board oneStepBefore, twoStepBefore;
	
	private int blackScore, whiteScore;
	
	private int steps;
	
	private boolean customizedPiece;
	
	private boolean validMove;
	
	/*
	 * True means black player and False means white player
	 */
	private boolean player, blackUndo, whiteUndo;
	
	private Piece pieceSelected;
	
	
    /** The menu bar on top including start, forfeit, undo. */
    private  JToolBar menuBar = new JToolBar(JToolBar.HORIZONTAL);
    
    /** The score bar at bottom show two players' score. */
    private JLabel scoreBar = new JLabel("",JLabel.CENTER);
    
    /** Listen to mouse and play the movement**/
    private ActionListener move = new MoveAction();
    
    /** start  a new game. */
    private ActionListener startAction = new StartGame();

    /** reStart the game. */
    private ActionListener reStartAction = new RestartGame();
    
    /** forfeit game. */
    private ActionListener forfeitAction = new ForfeitGame();
    
    /** undo game. */
    private ActionListener undoAction = new UndoGame();
	
    
    /* Followings are ActionListener 
     * For details can see @ http://www3.ntu.edu.sg/home/ehchua/programming/java/j4a_gui.html#zz-10.
     */
    
    
	/**
	 * The MoveAction Class.
	 * Player can move their own Pieces One step at their turn 
	 * If a player clicks a Piece One, It means he/she selects it
	 * If a player clicks a Piece Twice, It means he/she drops it
	 */
	private class MoveAction implements ActionListener {
		
		@Override
		public void actionPerformed(ActionEvent e) {
			Piece src = (Piece) e.getSource();
			if(pieceSelected == null){
				if (src.getOwnership() == player) {
					pieceSelected = (Piece) src;
					pieceSelected.setBackground(Color.CYAN);
				}else{
					JOptionPane.showMessageDialog(frame, "Not Your Turn", "Invalid", JOptionPane.PLAIN_MESSAGE);
				}
				return;
			}
			if (pieceSelected == src) {
				pieceSelected.setBackGround();
				pieceSelected = null;
				return;
			}
			
			int x = pieceSelected.getPosition().getFirst();
			int y = pieceSelected.getPosition().getSecond();
			int tX = src.getPosition().getFirst();
			int tY = src.getPosition().getSecond();
			//System.out.println(""+x+" " + y + " " + tX + " " + tY);
			boolean valid = myBoard.finalValidMove(x,y,tX,tY);//myBoard.validMoveOnBoard(x, y, tX, tY);
			if(valid){
				twoStepBefore = oneStepBefore==null? null:oneStepBefore.copy();
				oneStepBefore = myBoard.copy();
				myBoard.updateMove(x, y, tX, tY);
				System.out.println(x +" " + y + " " +tX +" " + tY);
				updateGUIComponents();
				pieceSelected = null;
				validMove =true;
				//System.out.println("game.validMove is " +validMove );
			}else { 
				JOptionPane.showMessageDialog(frame, "Invalid Move", "Invalid", JOptionPane.PLAIN_MESSAGE);
				pieceSelected.setBackGround();
				pieceSelected = null;
			}
		}
			
			
	}

	
	
	/**
	 * The StartGame Class.
	 * Start a new game and reset everything
	 */
	private class StartGame implements ActionListener {
        
        @Override
        public void actionPerformed(ActionEvent e) {
            int ret = JOptionPane.showConfirmDialog(frame,"Start a new game and reset everything?",
            		"Start",JOptionPane.YES_NO_OPTION);
            
            if( ret == JOptionPane.YES_OPTION ) {
                startGame();
            }
        }

        /**
         * Start new game. Reset everything of the game.
         */
        private void startGame() {
        	playersNameInput();
        	oneStepBefore = null;
        	pieceSelected = null;
        	twoStepBefore = null;
        	//System.out.println("s game.validMove is " +validMove );
        	validMove = false;
        	blackUndo = false;
        	whiteUndo = false;
        	whiteScore = 0;
            blackScore = 0;
            steps=0;
            player = true;
            initializeBoardUI();
        }
    }
	
	
	/**
	 * The ReStartGame Class.
	 * Restart the game and the score will be tied
	 */
	private class RestartGame implements ActionListener {
        
        @Override
        public void actionPerformed(ActionEvent e) {
            int blackRet = JOptionPane.showConfirmDialog(frame," Would Black player want to restart the game and the score will be tied?",
            		"Restart",JOptionPane.YES_NO_OPTION);
            int whiteRet = JOptionPane.showConfirmDialog(frame," Would White player want to restart the game and the score will be tied?",
            		"Restart",JOptionPane.YES_NO_OPTION);
            if( whiteRet == JOptionPane.YES_OPTION && blackRet == JOptionPane.YES_OPTION ) {
                restartGame();
            }
        }

        /**
         * Start new game. Reset everything of the game.
         */
        private void restartGame() {
            steps=0;
        	oneStepBefore = null;
        	//System.out.println("r game.validMove is " +validMove );
        	validMove = false;
        	pieceSelected = null;
        	twoStepBefore = null;
            blackUndo = false;
            whiteUndo = false;
            player = true;
            initializeBoardUI();
        }
    }
	
	
	/**
	 * The ReStartGame Class.
	 * Restart the game and the score will be tied
	 */
	private class ForfeitGame implements ActionListener {
        
        @Override
        public void actionPerformed(ActionEvent e) {
            int ret  = player? JOptionPane.showConfirmDialog(frame,
            			"Would Black player want to forfeit the game and White player will win?",
            			"ForfeitG",JOptionPane.YES_NO_OPTION):
            			JOptionPane.showConfirmDialog(frame,
            			"Would White player want to forfeit the game and Black player will win?",
                    	"ForfeitG",JOptionPane.YES_NO_OPTION);

            if( ret == JOptionPane.YES_OPTION ) {
            	forfeitGame();
            }
        }

        /**
         * Start new game. Reset everything of the game.
         */
        private void forfeitGame() {
            steps =0;
        	oneStepBefore = null;
        	//System.out.println("f game.validMove is " +validMove );
        	validMove = false;
        	pieceSelected = null;
        	twoStepBefore = null;
            blackUndo = false;
            whiteUndo = false;
            if(player)
            	whiteScore++;
            else 
            	blackScore++;
            player = true;
            initializeBoardUI();
        }
    }
	
	/**
	 * The Undo  Class.
	 */
	private class UndoGame implements ActionListener {
		
        @Override
        public void actionPerformed(ActionEvent e) {
            int ret = player? JOptionPane.showConfirmDialog(frame, "White player wants, would Balck player Agree?",
                    "Undo",JOptionPane.YES_NO_OPTION) :
                    JOptionPane.showConfirmDialog(frame, "Black player wants, would White player Agree?",
                    "Undo",JOptionPane.YES_NO_OPTION);
            if( ret == JOptionPane.YES_OPTION ) {
                undo();
            }
        }

        /**
         * allows a player to undo their last move ONLY
		 * returns turn to the player who performed the undo.
         * Can only undo one round at a time.
         * Can NOT undo at the first round.
         */
		private void undo() {
			boolean thePlayerUndo = player? blackUndo: whiteUndo;
			if (steps == 0) {
				JOptionPane.showMessageDialog(frame, "Cannot undo at beginning of the game", "CANNOT Undo",
						JOptionPane.WARNING_MESSAGE);
			}else{
				if(thePlayerUndo){
					JOptionPane.showMessageDialog(frame, "You already did Undo the game", "CANNOT Undo",
					JOptionPane.WARNING_MESSAGE);
				}else{
					myBoard = oneStepBefore.copy();
					oneStepBefore = twoStepBefore == null? null:twoStepBefore.copy();
					twoStepBefore = null;
					if(player)
						blackUndo = true;
					else 
						whiteUndo = true;
					player = !player;
					validMove = false;
					updateGUIComponents();
				}
			}				
		}
    }
	
	
	/**
	 * Get the name from each player
	 * Each player should be given a non-empty and unique name
	 */
	private void playersNameInput() {
			do {
					blackPlayer = JOptionPane.showInputDialog(frame, "Input non-empty black player's name",
						"Black Input", JOptionPane.QUESTION_MESSAGE);
			} while (blackPlayer == null || blackPlayer.length() == 0);
			
			do {
					whitePlayer = JOptionPane.showInputDialog(frame, "Input a different non-empty white player name",
						"White Input", JOptionPane.QUESTION_MESSAGE);
			} while (whitePlayer == null || whitePlayer.length() == 0 ||whitePlayer.equals(blackPlayer) );
			
			int ret = JOptionPane.showConfirmDialog(frame, "Customized Pieces Game?",
                    "Customized",JOptionPane.YES_NO_OPTION);
			
			customizedPiece = ret == JOptionPane.YES_OPTION;
  
	}
	
	/** public constructor for game **/
	public Game(){
		player = true;
	}
	
	 /**
     * Initialize chess board GUI.
     */
	public void initializeBoardUI() {
		myBoard = new Board(customizedPiece);
		updateGUIComponents();
		boardContainer.add(boardUI);
		scoreBar.setText(this.blackPlayer+"'s Score is: "+this.blackScore+"   V.S   "+this.whitePlayer+"'s Score is: "+this.whiteScore);
	}
	
	/*This function initialize GUI as whole
	 * It first initialize board container 
	 * and then initialize the board GUI
	 */
	private final void initialize(){
		boardContainer.setBorder(new EmptyBorder(5, 5, 5, 5));
		boardContainer.removeAll();
		
		/*To add Start, reStart, forfeit and undo function to menuBar*/
		JButton start = new JButton("Start");
		start.addActionListener(startAction);
		menuBar.add(start);
		JButton reStart = new JButton("Restart");
		reStart.addActionListener(reStartAction);
		menuBar.add(reStart);
		JButton forfeit = new JButton("Forfeit");
		forfeit.addActionListener(forfeitAction);
		menuBar.add(forfeit);
		JButton undo = new JButton("Undo");
		undo.addActionListener(undoAction);
		menuBar.add(undo);

		menuBar.setFloatable(false);
		menuBar.setVisible(true);
		
		boardContainer.add(menuBar, BorderLayout.PAGE_START);
		boardContainer.add(scoreBar, BorderLayout.PAGE_END);
		
        initializeBoardUI();
	}
	private final void initializeGUI() {
		playersNameInput();
		initialize();
    }

	
	/**
	 * Update pieces in the board.
	 * It simply loop the whole board 
	 */
	private void updateGUIComponents() {
		boardUI.removeAll();
		Piece[][] board = myBoard.getBoard();
		for (int i = 0; i <8; i++) {
			for (int j = 0; j<8; j++) {
				Piece piece = myBoard.havePiece(j, i);
				Space space = null;
				if (piece != null) {
					piece.setBackGround();
					board[i][j] = piece;
					boardUI.add(board[i][j], SwingConstants.CENTER);
				} else {
					space = new Space (j, i,false);
					space.setBackGround();
					boardUI.add(space, SwingConstants.CENTER);
				}	
				
				if(piece !=null){
					if( piece.getActionListeners().length == 0 )
						piece.addActionListener(move);
				}else{
					if( space.getActionListeners().length == 0 )
						space.addActionListener(move);
				}
				
			}
		}
		boardContainer.updateUI();
	}
/*
 * Three situation the a game will end
 * @param situation is 0 when in Stalemate condition
 * 	situation is 1 when black player wins
 * 	situation is 2 when white player wins
 */
	public void gameEnd(int situation){
		if(situation == 0){
			JOptionPane.showMessageDialog(null, "StaleMate Condition, NO WINEER", "Game End",
					JOptionPane.INFORMATION_MESSAGE);
		}else if(situation == 1){
			JOptionPane.showMessageDialog(null, "Black is the WINNER!", "Game End",
					JOptionPane.INFORMATION_MESSAGE);
			this.blackScore++;
		}
		else{
			JOptionPane.showMessageDialog(null, "White is the WINNER!", "Game End",
					JOptionPane.INFORMATION_MESSAGE);
			this.whiteScore++;
		}
	}
	
	public static void main(String[] args) {
		Game game = new Game();
		game.initializeGUI();
		game.frame = new JFrame("ChessGame");
		game.frame.add(game.boardContainer);
		game.frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		game.frame.setLocationByPlatform(true);
		game.frame.pack();
		game.frame.setMinimumSize(game.frame.getSize());
		game.frame.setVisible(true);
		while(true){
			while(true){
				/** update the Board GUI in each loop **/
				game.updateGUIComponents();
				
				/** At the beginning of the loop, always check stalemate and checkmate **/
				if (game.myBoard.stalemate(game.player)) {
					game.updateGUIComponents();
					game.gameEnd(0);
					break;
				}

				if(game.myBoard.canGoToKing(game.player)){
					if(game.myBoard.checkmate(game.player)){
						int situation = game.player?2:1;
						game.gameEnd(situation);
						break;
					}else{
						JOptionPane.showMessageDialog(null, game.player? ("Black player is in Check"):("White player is in Check!"), "Check",
								JOptionPane.INFORMATION_MESSAGE);
					}
				}
				
				/**Wait until there is a valid movement**/
				while (!game.validMove) {
					try {
						Thread.sleep(10);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
				System.out.println("Step is "+ game.steps);
				
				/**Reset parameters after each step**/
				game.player = !(game.player);
				game.validMove = false;
				game.steps++;
				game.blackUndo = false;
				game.whiteUndo = false;
			}
			
			game.initialize();
		}
	}
}
