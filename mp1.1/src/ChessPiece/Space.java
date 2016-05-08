package ChessPiece;

import javax.swing.ImageIcon;

public class Space extends Piece {
	/**
	 * 
	 */
	private static final long serialVersionUID = -7792403021186862680L;


	/*public Space constructor inherits from Piece*/
	public Space(int x, int y, boolean owner) {
		getPosition().setPair(x,y);
		setOwnership(owner);
		ImageIcon icon = new ImageIcon("images/Black/Space.png");
	    setIcon(icon);
	}
	
	public Piece copy(){
		Piece ret = new King(this.getPosition().getFirst(), this.getPosition().getSecond(),this.getOwnership());
		return ret;
	}
		

	public boolean isValidMove(int targetX, int targetY){
		return true;
	}
}
