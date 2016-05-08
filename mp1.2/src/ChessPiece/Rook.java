package ChessPiece;

import javax.swing.ImageIcon;

public class Rook extends Piece{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1261095952510492808L;

	/*public Rook
	 *constructor inherit from Piece
	 **/
	public Rook(int x, int y, boolean owner) {
		getPosition().setPair(x,y);
		setOwnership(owner);
		ImageIcon icon = new ImageIcon("images/"+( (owner)? "Black" : "White" )+"/Rook.png");
	    setIcon(icon);
	}
	
	public Piece copy(){
		Piece ret = new Rook (this.getPosition().getFirst(), this.getPosition().getSecond(),this.getOwnership());
		ret.setOwnership(this.getOwnership());
		ImageIcon icon = new ImageIcon("images/"+( (getOwnership())? "Black" : "White" )+"/Rook.png");
	    setIcon(icon);
		return ret;
	}
	
	/*method to determine whether it is a valid move for Rook on a blank board*/
	public boolean isValidMove(int targetX, int targetY){		
		/*check boundary condition*/
		if(outBoundary(targetX, targetY)){
			return false;
		}
		
		/*Rook can move in one direction*/
		return (targetX == getPosition().getFirst() && targetY != getPosition().getSecond()) 
				||(targetY == getPosition().getSecond() && targetX != getPosition().getFirst());
	}
}
