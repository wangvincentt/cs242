package ChessPiece;
import javax.swing.ImageIcon;

public class King extends Piece {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6204641539028410280L;

	/*public King constructor inherits from Piece*/
	public King(int x, int y, boolean owner) {
		getPosition().setPair(x,y);
		setOwnership(owner);
		ImageIcon icon = new ImageIcon("images/"+( (owner)? "Black" : "White" )+"/King.png");
	    setIcon(icon);
	}
	
	public Piece copy(){
		Piece ret = new King(this.getPosition().getFirst(), this.getPosition().getSecond(),this.getOwnership());
		return ret;
	}
		
	/*method to determine whether it is a valid move for King on a blank board
	 *it can only move following the rule */
	public boolean isValidMove(int targetX, int targetY){
		/*check boundary condition*/
		if(outBoundary(targetX, targetY)){
			return false;
		}
		int xDiff = Math.abs(getPosition().getFirst()-targetX);
		int yDiff = Math.abs(getPosition().getSecond()-targetY);
		return xDiff<2&&yDiff<2;
	}
}
