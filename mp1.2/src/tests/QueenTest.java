package tests;

import static org.junit.Assert.*;
import org.junit.Test;
import ChessPiece.*;

public class QueenTest {

	static Board board;
	@Test
	public void testconstructor() {
		board = new Board(true);
		Queen q1 = new Queen(3,0,false);
		Queen q2 = new Queen(3,7,true);
		assertTrue(q1.compare(board.havePiece(3,0)));
		assertTrue(q2.compare(board.havePiece(3,7)));
		assertFalse(q2.compare(board.havePiece(4,3)));
	}
	
	@Test
	public void isValidMove() {
		Queen q1 = new Queen(3,7,true);
		assertFalse("Move fail",q1.isValidMove(8,8));
		assertFalse("Move fail",q1.isValidMove(5,6));
		assertTrue("Move success",q1.isValidMove(3,0));
		assertTrue("Move success",q1.isValidMove(0,7));
	}

}
