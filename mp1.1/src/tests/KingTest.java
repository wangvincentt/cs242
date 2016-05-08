package tests;
import ChessPiece.*;
import static org.junit.Assert.*;

import org.junit.Test;

import ChessPiece.Board;

public class KingTest {

	static Board board;
	@Test
	public void testconstructor() {
		board = new Board();
		King b1 = new King(4,0,false);
		King b2 = new King(4,7,true);
		assertTrue(b1.compare(board.havePiece(4,0)));
		assertTrue(b2.compare(board.havePiece(4,7)));
	}
	
	@Test
	public void isValidMove() {
		King b1 = new King(2,7,true);
		assertFalse("Move fail",b1.isValidMove(4,6));
		assertFalse("Move fail",b1.isValidMove(9,6));
		assertTrue("Move success",b1.isValidMove(3,6));
	}

}
