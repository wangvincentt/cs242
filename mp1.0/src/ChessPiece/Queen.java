package ChessPiece;


public class Queen extends Piece {

	public Queen(int x, int y, boolean owner){
		position.setPair(x,y);
		setOwnership(owner);
	}
	
	public Piece copy(){
		Piece ret = new Queen (this.position.getFirst(), this.position.getSecond(),this.getOwnership());
		return ret;
	}
	
	/*Determine whether it is a valid move for queue. 
	 * Queue can only move diagonally 
	 * and I ignore any piece in the the queue's path (non-Javadoc)
	 * @see ChessPiece.Piece#isValidMove(int, int)
	 */
	public boolean isValidMove(int targetX, int targetY){
		int xDiff = Math.abs(position.getFirst()-targetX);
		int yDiff = Math.abs(position.getSecond()-targetY);
		
		/*check boundary condition*/
		if(outBoundary(targetX, targetY)){
			return false;
		}
		
		return (xDiff ==0 && yDiff!=0 || xDiff !=0 && yDiff ==0) ||(xDiff == yDiff);
	}

}
