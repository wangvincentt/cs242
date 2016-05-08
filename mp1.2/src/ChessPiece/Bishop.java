package ChessPiece;

import javax.swing.ImageIcon;

public class Bishop extends Piece{

	/**
	 * 
	 */
	private static final long serialVersionUID = 2022837334541851255L;


	/*This is Bishop constructor, x and y is position of the Bishop
	 * owner to define the Bishop belongs to which player
	 */
	public Bishop(int x, int y, boolean owner) {
		getPosition().setPair(x,y);
		setOwnership(owner);
		ImageIcon icon = new ImageIcon("images/"+( (owner)? "Black" : "White" )+"/Bishop.png");
	    setIcon(icon);
	}
	
	public Piece copy(){
		Piece ret = new Bishop(this.getPosition().getFirst(), this.getPosition().getSecond(),this.getOwnership());
		ret.setOwnership(this.getOwnership());
		ImageIcon icon = new ImageIcon("images/"+( (this.getOwnership())? "Black" : "White" )+"/Bishop.png");
	    setIcon(icon);
		return ret;
	}
	
	
	/*method to determine whether it is a valid move for Bishop
	 *on a blank board, it can only move diagonally
	 */
	public boolean isValidMove(int targetX, int targetY){		
		if(outBoundary(targetX, targetY)){
			return false;
		}
		int xDiff = Math.abs(getPosition().getFirst()-targetX);
		int yDiff = Math.abs(getPosition().getSecond()-targetY);
		
		if(xDiff == yDiff && xDiff!=0 ){
			return true;
		}
		else
			return false;
	}
}
