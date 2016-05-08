package ChessPiece;


public class Rook extends Piece{

	/*public Rook
	 *constructor inherit from Piece
	 **/
	public Rook(int x, int y, boolean owner) {
		position.setPair(x,y);
		setOwnership(owner);
	}
	
	public Piece copy(){
		Piece ret = new Rook (this.position.getFirst(), this.position.getSecond(),this.getOwnership());
		return ret;
	}
	
	/*method to determine whether it is a valid move for Rook on a blank board*/
	public boolean isValidMove(int targetX, int targetY){		
		/*check boundary condition*/
		if(outBoundary(targetX, targetY)){
			return false;
		}
		
		/*Rook can move in one direction*/
		return (targetX == position.getFirst() && targetY != position.getSecond()) 
				||(targetY == position.getSecond() && targetX != position.getFirst());
	}
}
