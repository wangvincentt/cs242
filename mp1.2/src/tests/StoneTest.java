package tests;
import ChessPiece.*;
import static org.junit.Assert.*;
import org.junit.Test;
import ChessPiece.Board;


public class StoneTest {

	static Board board;
	
	@Test
	public void testconstructor() {
		board = new Board(true);
		board.clear();
		Stone stone1 = new Stone (1,1,false);
		board.setPiece(1, 1, "Stone", false);
		assertTrue(board.havePiece(1,1) instanceof Stone);
		assertTrue(stone1.compare(board.havePiece(1,1)));
	}
	
	@Test
	public void isValidMove() {
		Stone Stone = new Stone(2,7,true);
		assertFalse("Move fail",Stone.isValidMove(4,6));
		assertFalse("Move fail",Stone.isValidMove(9,6));
		assertFalse("Move success",Stone.isValidMove(3,6));
	}

}
