package ChessPiece;

import javax.swing.ImageIcon;

public class Knight extends Piece{

	/**
	 * 
	 */
	private static final long serialVersionUID = 8882935574720855693L;

	/*public Knight constructor inherits from Piece*/
	public Knight(int x, int y, boolean owner) {
		getPosition().setPair(x,y);
		setOwnership(owner);
		ImageIcon icon = new ImageIcon("images/"+( (owner)? "Black" : "White" )+"/Knight.png");
	    setIcon(icon);
	}
	
	public Piece copy(){
		Piece ret = new Knight (this.getPosition().getFirst(), this.getPosition().getSecond(),this.getOwnership());
		return ret;
	}
	
	/*method to determine whether it is a valid move for Knight on a blank board
	 *it can only move following the rule */
	public boolean isValidMove(int targetX, int targetY){
		/*check boundary condition*/
		if(outBoundary(targetX, targetY)){
			return false;
		}
		int xDiff = Math.abs(getPosition().getFirst()-targetX);
		int yDiff = Math.abs(getPosition().getSecond()-targetY);
		return ((xDiff ==2 && yDiff ==1) ||(xDiff ==1 && yDiff ==2));
	}

}
