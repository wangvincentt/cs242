package ChessPiece;

import javax.swing.ImageIcon;

public class Pawn extends Piece{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 5648557177548799526L;
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
		getPosition().setPair(x,y);
		setOwnership(owner);
		setFirstMove(true);
		ImageIcon icon = new ImageIcon("images/"+( (owner)? "Black" : "White" )+"/Pawn.png");
	    setIcon(icon);
	}
	
	public Piece copy(){
		Piece ret = new Pawn (this.getPosition().getFirst(), this.getPosition().getSecond(),this.getOwnership());
		return ret;
	}
	
	/*Determine whether it is a valid move for pawn on blank board*/
	public boolean isValidMove(int targetX, int targetY){
		if(outBoundary(targetX, targetY)){
			return false;
		}
		
		int xDiff = Math.abs(getPosition().getFirst()-targetX);
		int yDiff = Math.abs(getPosition().getSecond()-targetY);
		if(getOwnership()){
			yDiff = yDiff*(-1);
		}
		
		if((xDiff ==0 && (yDiff ==2||yDiff ==1))|| (xDiff ==1 && yDiff ==1)){
			return true;
		}
		return false;
	}
}
