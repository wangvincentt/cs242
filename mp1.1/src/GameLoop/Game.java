package GameLoop;
import ChessPiece.Piece;
import ChessPiece.Board;
import ChessPiece.Space;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import javax.swing.JFrame;


public class Game {
	private Board myBoard;
	
	private JPanel boardUI = new JPanel( new GridLayout(0,8) );
	
	private final JPanel boardContainer = new JPanel( new BorderLayout(8,8) );
	
	private JFrame frame;
	
	 /**
     * Initialize chess board GUI.
     */
	public void initializeBoardUI() {
		myBoard = new Board();
		updateGUIComponents();
		boardContainer.add(boardUI);
	}
	
	/*This function initialize GUI as whole
	 * It first initialize board container 
	 * and then initialize the board GUI
	 */
	private final void initializeGUI() {
		boardContainer.setBorder(new EmptyBorder(5, 5, 5, 5));
		boardContainer.removeAll();
        initializeBoardUI();
    }

	
	/**
	 * Update pieces in the board.
	 */
	private void updateGUIComponents() {
		boardUI.removeAll();
		Piece[][] board = myBoard.getBoard();
		for (int i = 0; i <8; i++) {
			for (int j = 0; j<8; j++) {
				Piece piece = myBoard.havePiece(j, i);
				if (piece != null) {
					piece.setBackGround();
					board[i][j] = piece;
					boardUI.add(board[i][j], SwingConstants.CENTER);
				} else {
					Space space = new Space (j, i,false);
					space.setBackGround();
					boardUI.add(space, SwingConstants.CENTER);
				}		
			}
		}
		boardContainer.updateUI();
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
	}
}
