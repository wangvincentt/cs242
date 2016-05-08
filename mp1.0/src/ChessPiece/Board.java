package ChessPiece;

/*Board has 8*8 grids*/

public class Board {
	protected Piece [][] board; 
	private Pair kingOne = new Pair(), kingTwo = new Pair();

	/*default constructor*/
	public Board()
	{
		board = new Piece [8][8];
		/*create pieces for two players with default Pieces positions on the board*/
		board[0][0] = new Rook(0,0,false);
		board[0][7] = new Rook(7,0,false); 
		board[0][1] = new Knight(1,0,false); 
		board[0][6] = new Knight(6,0,false); 
		board[0][2] = new Bishop(2,0,false); 
		board[0][5] = new Bishop(5,0,false);
		board[0][3] = new Queen(3,0,false); 
		board[0][4] = new King(4,0,false); 
		
		board[7][0] = new Rook(0,7,true);
		board[7][7] = new Rook(7,7,true);
		board[7][1] = new Knight(1,7,true); 
		board[7][6] = new Knight(6,7,true); 
		board[7][2] = new Bishop(2,7,true); 
		board[7][5] = new Bishop(5,7,true); 
		board[7][3] = new Queen(3,7,true); 
		board[7][4] = new King(4,7,true); 
		
		for(int i=0; i<8;i++){
			board[1][i] = new Pawn(i,1,false);
			board[6][i] = new Pawn(i,6,true);
		}
		kingOne.setPair(4, 7); 
		kingTwo.setPair(4, 0); 
	}
	
	public Board copy(){
		Board ret = new Board();
		ret.clear();
		for(int i =0; i< 8; i++){
			for(int j =0; j<8; j++){
				if (this.board[i][j]!=null)
					ret.board[i][j] = this.board[i][j].copy();
			}
		}
		ret.kingOne = new Pair (this.kingOne);
		ret.kingTwo = new Pair (this.kingTwo);
		return ret;
	}

	/*This is destructor for Board*/
	public void clear(){
		for(int i=0;i<8;i++){
			for(int j=0;j<8;j++){
				board[i][j] = null;
			}
		}
	}
	
	/*Return the Piece Object on position (x,y). 
	 * If it is out of boundary or there is no Piece on that position
	 * return null
	 */
	public Piece havePiece(int x, int y){
		if(x>7 || y>7)
			return null;
		return board[y][x];
	}
	
	/*This function will set a Piece on the Board w/ given (x,y)
	 * and owner is to determine the ownership of the piece
	 * and string c with 'Biship', 'King', 'Knight', 'Pawn','Queen' 
	 * and 'r' = Rook
	 * This function is most for TEST purpose
	 */
	public void setPiece(int x, int y, String name, boolean owner){
		if( name.equals("Bishop")){
			board[y][x] = new Bishop(x,y,owner);
		}
		else if(name.equals("King")){
			if(owner){
				kingOne.setFirst(x);
				kingOne.setSecond(y);
			}
			else{
				kingTwo.setFirst(x);
				kingTwo.setSecond(y);
			}
			board[y][x] = new King(x,y,owner);
		}
		else if (name.equals("Knight")){
			board[y][x] = new Knight(x,y,owner);
		}
		else if (name.equals("Pawn")){
			board[y][x] = new Pawn(x,y,owner);
		}
		else if (name.equals("Queen")){
			board[y][x] = new Queen(x,y,owner);
		}
		else if(name.equals("Rook")){
			board[y][x] = new Rook(x,y,owner);
		}
	}
	
	/*This method assumes in board boundary and move diagonally
	 * we need to check whether there is a piece on the path
	 * (x,y) and (tX,tY) are two positions given to check
	 */
	public boolean checkDiagonal(int x, int y, int tX, int tY){
		int xDirection = (tX - x)/Math.abs(tX - x);
		int yDirection = (tY - y)/Math.abs(tY - y);
		int steps = Math.abs(tX - x);
		for(int i= 1; i<steps; i++){
			int nextY = y+(yDirection*i);
			int nextX = x+(xDirection)*i;
			if(board[nextY][nextX]!=null)
				return false;
		}
		return true;
	}
	
	/*This method assumes piece is in board boundary and moves in line
	 * we need to check whether there is a piece on the path
	 * given positions(x,y) and (tX,tY)
	 */
	public boolean checkInLine(int x, int y, int tX, int tY){
		int xDiff = Math.abs(tX-x);
		int yDiff = Math.abs(tY-y);
		/*piece moves in y-direction*/
		if(xDiff ==0){
			int yDirection = (tY - y)/yDiff;
			for(int i=1; i<yDiff;i++){
				int nextY = y+yDirection*(i);
				if(board[nextY][x] !=null)
					return false;
			}
			return true;
		}
		else if(yDiff == 0){
			int yDirection = (tX - x)/xDiff;
			for(int i=1; i<xDiff ;i++){
				int nextX = x+yDirection*(i);
				if(board[y][nextX]!=null)
					return false;
			}
			return true;
		}
		return false;
	}
	
	/*This function only check whether the Piece can move on board validly
	 * we ignore Check and Checkmate here
	 */
	public boolean validMoveOnBoard(int x, int y, int tX, int tY)
	{
		/*check whether they are in boundary, or players are moving empty piece 
		 * or beat Pieces has same Ownership
		 **/
		if (Piece.outBoundary(x,y) ||Piece.outBoundary(tX, tY))
			return false;
		if(board[y][x] == null)
			return false;
		if(board[y][x].ownerCmp(board[tY][tX]))
			return false;
		
		/*we first check whether it is a valid move one a blank board 
		 * by their own property
		 */
		if(board[y][x].isValidMove(tX, tY)){
			/*Do not need to check for Knight and King for their own property*/
			if(board[y][x] instanceof Knight ||board[y][x] instanceof King )
				return true;
			if( board[y][x] instanceof Bishop )
					return checkDiagonal(x,y,tX,tY);
			else if(board[y][x] instanceof Pawn){
				Pawn thisPawn= (Pawn)board[y][x];
				int xDiff = Math.abs(thisPawn.position.getFirst()-tX);
				int yDiff = tY-thisPawn.position.getSecond();
				if(thisPawn.getOwnership())
					yDiff = yDiff*(-1);
				
				/*If there is a Piece in destination position,
				 * Pawn can only one step diagonally
				 * If there is no Piece, it can move two steps forward at first move
				 * and there is no Piece between them or move 1 step forward in later steps
				 */
				if(board[tY][tX]!=null ){
					return xDiff ==1 && yDiff ==1;
				}
				else {
					if(xDiff ==0 && yDiff ==1)
						return true;
					else if(xDiff ==0 && yDiff ==2){
						if(!thisPawn.getFirstMove())
							return false;
						return board[(y+tY)/2][x] ==null;
					}
					return false;
				}
			} 
			else if(board[y][x] instanceof Queen){
				int xDiff = Math.abs(tX-x);
				int yDiff = Math.abs(tY-y);
				if((xDiff ==0 && yDiff !=0) ||(xDiff!=0 && yDiff ==0))
					return checkInLine(x,y,tX,tY);
				else if(xDiff !=0 && yDiff!=0)
					return checkDiagonal(x, y, tX, tY); 
				else
					return false;
			}
			else if(board[y][x] instanceof Rook)
				return checkInLine(x,y,tX,tY);
		}
		return false;
	}
	
	/*this assume the move is valid and we will replace the destination position 
	 * with the original Piece and update the rest things
	 **/
	public void updateMove(int x, int y, int targetX, int targetY){
		if(board[y][x]==null)
			return;
		board[targetY][targetX] = board[y][x].copy();
		board[y][x] = null;
	}

	public boolean canGoToKing(boolean ownership){
		int xPosition,yPosition;
		xPosition = ownership?kingOne.getFirst():kingTwo.getFirst();
		yPosition = ownership?kingOne.getSecond():kingTwo.getSecond();
		for(int i =0; i<8;i++){
			for(int j=0; j<8;j++){
				if(board[j][i]!=null && board[j][i].getOwnership()!=ownership){
					if(validMoveOnBoard(i,j,xPosition,yPosition))
						return true;
				}
			}
		}
		return false;
	}

	/*new write function, need to fully test*/
	public boolean finalValidMove (int x, int y, int tx, int ty){
		if(board[y][x] == null)
			return false;
		boolean ownership = board[y][x].getOwnership();
		boolean validMove = validMoveOnBoard(x,y,tx,ty);
		updateMove(x, y, tx, ty);
		boolean check = canGoToKing(ownership);
		updateMove(tx, ty, x, y);
		return validMove && (!check);
	}
	
	/* This function check whether the ownership's king is in checkmate
	 * we must test every possible step for that player to check 
	 * whether he/she is in checkmate condition 
	 * */

	public boolean noMove(boolean ownership){
		for(int i =0; i<8; i++){
			for(int j =0; j<8; j++){
				if(board[i][j] !=null && board[i][j].getOwnership() ==ownership){
					for(int ii =0; ii<8;ii++){
						for(int jj =0; jj<8;jj++){
							if(this.finalValidMove(j,i,jj,ii)){
								Board myCopy = this.copy();
								myCopy.updateMove(j, i, jj, ii);
								if(!myCopy.canGoToKing(ownership))
									return false;
							}
						}
					}
				}
			}
		}
		return true;
	}
	public boolean checkmate (boolean ownership){
		return canGoToKing(ownership) && noMove(ownership);		
	}
	
	/* This function to check whether the ownership's king is in stalemate condition
	 * This condition is */
	public boolean stalemate (boolean ownership){
		return (!canGoToKing(ownership)) && noMove(ownership);
	}
	


}
