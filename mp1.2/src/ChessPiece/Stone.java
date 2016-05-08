package ChessPiece;

import javax.swing.ImageIcon;

public class Stone extends Piece {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2376838290415406560L;


	/*This is Stone constructor, x and y is position of the Stone
	 * owner to define the Stone belongs to which player
	 */
	public Stone(int x, int y, boolean owner) {
		getPosition().setPair(x,y);
		setOwnership(owner);
		ImageIcon icon = new ImageIcon("images/"+( (owner)? "Black" : "White" )+"/Stone.png");
	    setIcon(icon);
	}
	
	public Piece copy(){
		Piece ret = new Stone(this.getPosition().getFirst(), this.getPosition().getSecond(),this.getOwnership());
		ret.setOwnership(this.getOwnership());
		ImageIcon icon = new ImageIcon("images/"+( (getOwnership())? "Black" : "White" )+"/Stone.png");
	    setIcon(icon);
		return ret;
	}
	
	
	/*Stone cannot move at all*/
	public boolean isValidMove(int targetX, int targetY){	

		int xDiff = Math.abs(getPosition().getFirst()-targetX);
		int yDiff = Math.abs(getPosition().getSecond()-targetY);
		return (xDiff ==0 && yDiff ==0);
	}
}
