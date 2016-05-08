package ChessPiece;

import javax.swing.ImageIcon;

public class Queen extends Piece {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8828711611696184993L;

	public Queen(int x, int y, boolean owner){
		getPosition().setPair(x,y);
		setOwnership(owner);
		ImageIcon icon = new ImageIcon("images/"+( (owner)? "Black" : "White" )+"/Queen.png");
	    setIcon(icon);
	}
	
	public Piece copy(){
		Piece ret = new Queen (this.getPosition().getFirst(), this.getPosition().getSecond(),this.getOwnership());
		return ret;
	}
	
	/*Determine whether it is a valid move for queue. 
	 * Queue can only move diagonally 
	 * and I ignore any piece in the the queue's path (non-Javadoc)
	 * @see ChessPiece.Piece#isValidMove(int, int)
	 */
	public boolean isValidMove(int targetX, int targetY){
		int xDiff = Math.abs(getPosition().getFirst()-targetX);
		int yDiff = Math.abs(getPosition().getSecond()-targetY);
		
		/*check boundary condition*/
		if(outBoundary(targetX, targetY)){
			return false;
		}
		
		return (xDiff ==0 && yDiff!=0 || xDiff !=0 && yDiff ==0) ||(xDiff == yDiff);
	}

}
