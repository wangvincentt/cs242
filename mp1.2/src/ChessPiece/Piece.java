package ChessPiece;

import java.awt.*;
import javax.swing.*;


/*This is the abstract class for pieces 
 *Each piece objects have certain valid move
 */
public abstract class Piece extends JButton {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -2775937032128095346L;

	private boolean player;
	
	
	/*upper left is (0,0) and lower right is (7,7)*/
	private Pair position = new Pair();

	abstract public boolean isValidMove(int targetX, int targetY);
	abstract public Piece copy ();
	
	/**
	 * Sets the background color of the board.
	 */
	public void setBackGround(){
		setBackground((this.position.getFirst() + this.position.getSecond()) % 2 == 0 ? Color.WHITE : new Color(255,160,122));
		setOpaque(true);
		setBorderPainted(false);
	}
	
	public boolean getOwnership(){
		return player;
	}
		
	public Pair getPosition(){
		return position;
	}
	
	protected void setOwnership(boolean owner){
		this.player = owner;
	}
	
	public boolean ownerCmp(Piece other){
		if(other == null){
			return false;
		}

		return this.getOwnership() == other.getOwnership();
	}
	
	public static  boolean outBoundary(int targetX, int targetY){
		if(targetX >7 || targetY >7 || targetX <0 || targetY <0){
			return true;
		}
		return false;
	}
	
	/*This function will compare whether two pieces are actually the same piece*/
	public boolean compare(Piece other){
		if(other ==null){
			return false;
		}
		return (other.position.getFirst() == this.position.getFirst() && other.position.getSecond() ==this.position.getSecond() && 
				other.getOwnership() == this.getOwnership());
	}
	
}
