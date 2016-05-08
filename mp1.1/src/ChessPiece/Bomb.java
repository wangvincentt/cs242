package ChessPiece;

import javax.swing.ImageIcon;

public class Bomb extends Piece {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2574283613524009456L;

	/*public Bomb constructor inherits from Piece*/
	public Bomb(int x, int y, boolean owner) {
		getPosition().setPair(x,y);
		setOwnership(owner);
		ImageIcon icon = new ImageIcon("images/"+( (owner)? "Black" : "White" )+"/Bomb.png");
	    setIcon(icon);
	}
	
	public Piece copy(){
		Piece ret = new King(this.getPosition().getFirst(), this.getPosition().getSecond(),this.getOwnership());
		return ret;
	}
		
	/*method to determine whether it is a valid move for Bomb on a blank board
	 *it can only move following the rule */
	public boolean isValidMove(int targetX, int targetY){
		/*check boundary condition*/
		if(outBoundary(targetX, targetY)){
			return false;
		}
		/*Bomb can move in one direction*/
		return (targetX == getPosition().getFirst() && targetY != getPosition().getSecond()) 
				||(targetY == getPosition().getSecond() && targetX != getPosition().getFirst());
	}
}
