package ChessPiece;
public class Knight extends Piece{

	/*public Knight constructor inherits from Piece*/
	public Knight(int x, int y, boolean owner) {
		position.setPair(x,y);
		setOwnership(owner);
	}
	
	public Piece copy(){
		Piece ret = new Knight (this.position.getFirst(), this.position.getSecond(),this.getOwnership());
		return ret;
	}
	
	/*method to determine whether it is a valid move for Knight on a blank board
	 *it can only move following the rule */
	public boolean isValidMove(int targetX, int targetY){
		/*check boundary condition*/
		if(outBoundary(targetX, targetY)){
			return false;
		}
		int xDiff = Math.abs(position.getFirst()-targetX);
		int yDiff = Math.abs(position.getSecond()-targetY);
		return ((xDiff ==2 && yDiff ==1) ||(xDiff ==1 && yDiff ==2));
	}

}
