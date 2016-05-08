package ChessPiece;
/*This is the abstract class for pieces 
 *Each piece objects have certain valid move
 */
public abstract class Piece {
	
	private boolean player;
	
	/*upper left is (0,0) and lower right is (7,7)*/
	public Pair position = new Pair();

	abstract public boolean isValidMove(int targetX, int targetY);
	abstract public Piece copy ();
	
	public boolean getOwnership(){
		return player;
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
