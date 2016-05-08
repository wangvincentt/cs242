package ChessPiece;

public class Pawn extends Piece{
	
	/*Determine whether the pawn has first move*/
	private boolean firstMove;
	
	public boolean getFirstMove(){
		return firstMove;
	}
	
	protected void setFirstMove(boolean first){
		firstMove = first;
	}
	
	/*public Pawn constructor inherit from Piece*/
	public Pawn(int x, int y, boolean owner){
		position.setPair(x,y);
		setOwnership(owner);
		setFirstMove(true);
	}
	
	public Piece copy(){
		Piece ret = new Pawn (this.position.getFirst(), this.position.getSecond(),this.getOwnership());
		return ret;
	}
	
	/*Determine whether it is a valid move for pawn on blank board*/
	public boolean isValidMove(int targetX, int targetY){
		if(outBoundary(targetX, targetY)){
			return false;
		}
		
		int xDiff = Math.abs(position.getFirst()-targetX);
		int yDiff = Math.abs(position.getSecond()-targetY);
		if(getOwnership()){
			yDiff = yDiff*(-1);
		}
		
		if((xDiff ==0 && (yDiff ==2||yDiff ==1))|| (xDiff ==1 && yDiff ==1)){
			return true;
		}
		return false;
	}
}
