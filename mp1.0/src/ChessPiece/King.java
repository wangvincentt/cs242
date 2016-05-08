package ChessPiece;

public class King extends Piece {
	/*public King constructor inherits from Piece*/
	public King(int x, int y, boolean owner) {
		position.setPair(x,y);
		setOwnership(owner);
	}
	
	public Piece copy(){
		Piece ret = new King(this.position.getFirst(), this.position.getSecond(),this.getOwnership());
		return ret;
	}
		
	/*method to determine whether it is a valid move for King on a blank board
	 *it can only move following the rule */
	public boolean isValidMove(int targetX, int targetY){
		/*check boundary condition*/
		if(outBoundary(targetX, targetY)){
			return false;
		}
		int xDiff = Math.abs(position.getFirst()-targetX);
		int yDiff = Math.abs(position.getSecond()-targetY);
		return xDiff<2&&yDiff<2;
	}
}
