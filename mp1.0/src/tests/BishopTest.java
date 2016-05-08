package tests;
import ChessPiece.*;

import static org.junit.Assert.*;

import org.junit.Test;
public class BishopTest {

	static Board board;
	
	
	@Test
	public void testconstructor() {
		board = new Board();
		Bishop b1 = new Bishop(2,7,true);
		Bishop b2 = new Bishop(5,7,true);
		Bishop b3 = new Bishop(2,0,false);
		Bishop b4 = new Bishop(5,0,false);
		assertTrue(b1.compare(board.havePiece(2,7)));
		assertTrue(b2.compare(board.havePiece(5,7)));
		assertTrue(b3.compare(board.havePiece(2,0)));
		assertTrue(b4.compare(board.havePiece(5,0)));
//		fail("Not yet implemented");
	}

	
	@Test
	public void isValidMove() {
		Bishop b1 = new Bishop(2,7,true);
		assertTrue("Move success",b1.isValidMove(3,6));
		assertFalse("Move fail",b1.isValidMove(5,6));
		assertFalse("Move fail",b1.isValidMove(9,9));
	}
}
