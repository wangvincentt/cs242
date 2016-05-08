package ChessPiece;

public class Bishop extends Piece{

	/*This is Bishop constructor, x and y is position of the Bishop
	 * owner to define the Bishop belongs to which player
	 */
	public Bishop(int x, int y, boolean owner) {
		position.setPair(x,y);
		setOwnership(owner);
	}
	
	public Piece copy(){
		Piece ret = new Bishop(this.position.getFirst(), this.position.getSecond(),this.getOwnership());
		return ret;
	}
	
	
	/*method to determine whether it is a valid move for Bishop
	 *on a blank board, it can only move diagonally
	 */
	public boolean isValidMove(int targetX, int targetY){		
		/*check boundary condition*/
		if(outBoundary(targetX, targetY)){
			return false;
		}
		
		int xDiff = Math.abs(position.getFirst()-targetX);
		int yDiff = Math.abs(position.getSecond()-targetY);
		
		/*Bishop can only move diagonally*/
		if(xDiff == yDiff && xDiff!=0 ){
			return true;
		}
		else
			return false;
	}
}
