package tests;
import static org.junit.Assert.*;
import ChessPiece.*;
import org.junit.Test;

public class RookTest {

	static Board board;
	@Test
	public void testconstructor() {
		board = new Board(true);
		Rook r1 = new Rook(0,0,false);
		Rook r2 = new Rook(0,7,true);
		assertTrue(r1.compare(board.havePiece(0,0)));
		assertTrue(r2.compare(board.havePiece(0,7)));
		assertFalse(r2.compare(board.havePiece(4,3)));
	}
	
	@Test
	public void isValidMove() {
		Rook q1 = new Rook(3,3,true);
		assertFalse("Move fail",q1.isValidMove(8,8));
		assertFalse("Move fail",q1.isValidMove(5,6));
		assertTrue("Move success",q1.isValidMove(3,0));
		assertTrue("Move success",q1.isValidMove(3,7));
		assertTrue("Move success",q1.isValidMove(0,3));
		assertTrue("Move success",q1.isValidMove(7,3));
	}
}
