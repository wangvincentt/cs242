package ChessPiece;

import javax.swing.ImageIcon;

public class Pawn extends Piece{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 5648557177548799526L;
	/*Determine whether the pawn has first move*/
	protected boolean firstMove;
	
	public boolean getFirstMove(){
		return firstMove;
	}
	
	protected void setFirstMove(boolean first){
		firstMove = first;
	}
	
	/*public Pawn constructor inherit from Piece*/
	public Pawn(int x, int y, boolean owner,boolean first){
		getPosition().setPair(x,y);
		setOwnership(owner);
		setFirstMove(first);
		ImageIcon icon = new ImageIcon("images/"+( (owner)? "Black" : "White" )+"/Pawn.png");
	    setIcon(icon);
	}
	
	public Piece copy(){
		
		Piece ret = new Pawn (this.getPosition().getFirst(), this.getPosition().getSecond(),this.getOwnership(), this.firstMove);
		ret.setOwnership(this.getOwnership());
		ImageIcon icon = new ImageIcon("images/"+( (getOwnership())? "Black" : "White" )+"/Pawn.png");
	    setIcon(icon);
		return ret;
	}
	
	/*Determine whether it is a valid move for pawn on blank board*/
	public boolean isValidMove(int targetX, int targetY){
		if(outBoundary(targetX, targetY)){
			return false;
		}
		
		int xDiff = Math.abs(getPosition().getFirst()-targetX);
		int yDiff = getPosition().getSecond()-targetY;
		if(!getOwnership()){
			yDiff = yDiff*(-1);
		}
		//System.out.println(xDiff + " " + yDiff);
		if((xDiff ==0 && (yDiff ==2||yDiff ==1))|| (xDiff ==1 && yDiff ==1)){
			return true;
		}
		return false;
	}
}
