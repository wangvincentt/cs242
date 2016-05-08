package tests;
import ChessPiece.*;
import static org.junit.Assert.*;

import org.junit.Test;

import ChessPiece.Board;

public class KnightTest {

	static Board board;
	@Test
	public void testconstructor() {
		board = new Board();
		Knight b1 = new Knight(1,0,false);
		Knight b2 = new Knight(1,7,true);
		assertTrue(b1.compare(board.havePiece(1,0)));
		assertTrue(b2.compare(board.havePiece(1,7)));
	}
	
	@Test
	public void isValidMove() {
		Knight b1 = new Knight(2,3,true);
		assertFalse("Move fail",b1.isValidMove(8,6));
		assertFalse("Move fail",b1.isValidMove(1,6));
		assertTrue("Move success",b1.isValidMove(1,1));
		assertTrue("Move success",b1.isValidMove(0,2));
		assertTrue("Move success",b1.isValidMove(3,5));
		assertTrue("Move success",b1.isValidMove(4,4));
	}

}
