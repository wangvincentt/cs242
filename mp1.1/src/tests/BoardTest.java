package tests;
import ChessPiece.*;import static org.junit.Assert.*;

import org.junit.Test;

public class BoardTest {

	static Board board;
	
	/*No need test for Board Constructor, already did it in other Pieces test*/
	
	@Test
	public void testBoardDestructor() {
		board = new Board();
		board.clear();
		for(int i =0; i<8;i++){
			for(int j =0; j<8; j++){
				assertTrue(board.havePiece(j,i) ==null);
			}
		}	
	}
	
	@Test
	public void testBoardCopy() {
		board = new Board();
		board.clear();
		board.setPiece(0, 0, "King", true);
		board.setPiece(0, 2, "Queen", false);
		board.setPiece(2, 0, "Queen", true);
		Board myCopy = board.copy();
		assertTrue(board.havePiece(0,0) != null);
		assertTrue(myCopy.havePiece(0,0) instanceof King);
	}
	
	@Test /*Mainly to test whether the hashMap works here*/
	public void testUpdateMove(){
		board = new Board();
		board.clear();
		board.setPiece(0, 0, "King", true);
		board.setPiece(0, 2, "Queen", false);
		board.setPiece(2, 0, "Queen", true);
		board.updateMove(0, 2, 0, 0);
		assertTrue(board.havePiece(0,2)==null);
		assertTrue(board.havePiece(0,0) instanceof Queen);
		
		
		/*Test for boom here*/
		board.setPiece(0, 2, "Bomb", true);
		board.updateMove(0, 2, 0, 0);
		assertTrue(board.havePiece(0,2)==null && (board.havePiece(0,0) ==null));
	}
	

	@Test
	public void testcanGoToKing(){
		board = new Board();
		board.clear();
		board.setPiece(4, 0, "King", false);
		board.setPiece(4, 1, "Queen", false);
		board.setPiece(4, 2, "Rook", true);
		assertTrue(board.canGoToKing(false)==false);
		board.setPiece(5, 1, "Queen", true);
		assertTrue(board.canGoToKing(false)==true);
		
	}
	
	@Test
	public void testvalidMoveOnBoard(){
		board = new Board();
		assertTrue(board.validMoveOnBoard(1, 1, 1, 3));
		board.updateMove(1, 1, 1, 3);
		assertTrue(!board.validMoveOnBoard(1, 3, 1, 5));
		assertTrue(!board.validMoveOnBoard(4, 0, 4, 1));
		board.clear();
		/*Test for Pawn to beat other Pieces*/
		board.setPiece(0, 1, "Pawn", true);
		board.setPiece(1, 2, "Rook", false);
		assertTrue(!board.validMoveOnBoard(0, 1, 1, 2));
		board.setPiece(0, 1, "Pawn", false);
		board.setPiece(1, 2, "Rook", true);
		assertTrue(board.validMoveOnBoard(0, 1, 1, 2));
		assertTrue(board.validMoveOnBoard(0, 1, 0, 3));
		board.setPiece(0, 2, "Queen", false);
		assertTrue(!board.validMoveOnBoard(0, 1, 0, 3));
		board.clear();
		board.setPiece(0, 1, "Rook", true);
		board.setPiece(0, 2, "Rook", true);
		assertTrue(board.validMoveOnBoard(0, 1, 3, 1));
		assertTrue(!board.validMoveOnBoard(0, 1, 0, 5));
		board.clear();
		board.setPiece(0, 1, "Bishop", true);
		board.setPiece(1, 2, "Bishop", true);
		assertTrue(!board.validMoveOnBoard(0, 1, 1, 2));
		assertTrue(!board.validMoveOnBoard(0, 1, 2, 3));
		assertTrue(!board.validMoveOnBoard(0, 1, 5, 3));
		assertTrue(!board.validMoveOnBoard(0, 0, 1, 2));
		assertTrue(board.validMoveOnBoard(1, 2, 5, 6));
		board.clear();
		board.setPiece(0, 1, "Knight", true);
		assertTrue(!board.validMoveOnBoard(0, 1, 1, 2));
		assertTrue(board.validMoveOnBoard(0, 1, 1, 3));
		board.clear();
		board.setPiece(0, 1, "King", true);
		assertTrue(!board.validMoveOnBoard(0, 1, 1, 5));
		assertTrue(board.validMoveOnBoard(0, 1, 1, 2));
		board.clear();
		board.setPiece(0, 2, "Queen", false);
		assertTrue(board.validMoveOnBoard(0, 2, 0, 7));
		assertTrue(board.validMoveOnBoard(0, 2, 7, 2));
		assertTrue(board.validMoveOnBoard(0, 2, 5, 7));
		board.setPiece(0, 3, "Queen", true);
		assertTrue(!board.validMoveOnBoard(0, 2, 0, 4));
		assertTrue(board.validMoveOnBoard(0, 2, 0, 3));
	}
	@Test
	public void testfinalValidMove(){
		board = new Board();
		board.clear();
		board.setPiece(0, 1, "King", true);
		board.setPiece(0, 2, "Queen", true);
		board.setPiece(0, 3, "Queen", false);
		assertTrue(!board.finalValidMove(0, 2, 2, 2));
	}
	@Test
	public void testcheckMate(){
		board = new Board();
		board.clear();
		board.setPiece(0, 0, "King", true);
		board.setPiece(7, 0, "Queen", false);
		board.setPiece(7, 1, "Queen", false);
		assertTrue(board.checkmate(true));
		board.setPiece(4, 0, "Queen", true);
		assertFalse(board.checkmate(true));
	}
	
	public void teststaleMate(){
		board = new Board();
		board.clear();
		board.setPiece(0, 0, "King", true);
		board.setPiece(2, 1, "Queen", false);
		board.setPiece(3, 3, "King", false);
		assertFalse(board.stalemate(true));
	}
	
	

}
