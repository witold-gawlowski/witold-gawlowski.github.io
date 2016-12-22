import java.math.BigInteger;
import java.util.*;


public class Polynomial {
	private TreeMap<Long, BigInteger> h = new TreeMap<Long, BigInteger>();//na moment public!!
	
	public Polynomial(){
		h.put(1L, BigInteger.ONE);
	}
	
	public Polynomial(int n, int l, int m){
		if(n!=0)
			h.put(0L, BigInteger.valueOf(n));
		if(l!=0)
			h.put(1L, BigInteger.valueOf(l));
		if(m!=0)
			h.put(2L, BigInteger.valueOf(m));
	}
	
	public Polynomial(int n){
		if(n!=0)
			h.put(0L, BigInteger.valueOf(n));
	}
	
	public Polynomial(BigInteger n){
		if(!n.equals(BigInteger.ZERO))
			h.put(0L, n);
	}
	
	public static Polynomial add(Polynomial G, Polynomial H){
		Polynomial result = new Polynomial(0);
		result.h.putAll(G.h);
		for(Map.Entry<Long, BigInteger> e: H.h.entrySet()){
			if(result.h.containsKey(e.getKey())){
				BigInteger sum = result.h.get(e.getKey()).add(e.getValue());
				result.h.remove(e.getKey());
				if(sum.compareTo(BigInteger.valueOf(0L))!=0)
					result.h.put(e.getKey(), sum);
			}else{
				result.h.put(e.getKey(), e.getValue());
			}
		}
		return result;
	}
	
	public String toString(){
		String result = "";
		if(h.isEmpty())
			return "";
		for(Map.Entry<Long, BigInteger> e: h.descendingMap().entrySet()){
			if(e.getValue().compareTo(BigInteger.ZERO)>0)
				result = result + " + ";
			else
				result = result + " - ";
			if(!e.getValue().abs().equals(BigInteger.ONE)||e.getKey().equals(0L))
				result = result + e.getValue().abs();
			if(!e.getKey().equals(0L))
				result = result + "x";
			if(e.getKey().compareTo(2L)>=0)
				result = result + "^" + e.getKey();
		}
		if(result.substring(0, 3).equals(" + "))
			result = result.substring(3, result.length());
		else
			result = "-" +  result.substring(3, result.length());
		return result;
	}
	
	public static Polynomial multiply(Polynomial G, Polynomial H){
		Polynomial result = new Polynomial(0);
		for(Map.Entry<Long, BigInteger> e: G.h.entrySet())
			for(Map.Entry<Long, BigInteger> f: H.h.entrySet()){
				Long p = e.getKey() + f.getKey();
				BigInteger c = e.getValue().multiply(f.getValue());
				//System.out.println(e.getKey()+" "+f.getKey()+" "+p+" "+c);
				if(!result.h.containsKey(p))
					result.h.put(p, c);
				else{
					BigInteger temp = result.h.get(p).add(c);
					result.h.remove(p);
					if(!temp.equals(BigInteger.ZERO))
						result.h.put(p, temp);
				}
			}
		return result;
	}
	
	public static Polynomial compose(Polynomial G, Polynomial H){
		Polynomial result = new Polynomial(0);
		for(Map.Entry<Long, BigInteger> e: G.h.entrySet()){
			BigInteger c = e.getValue();
			Long p = e.getKey();
			Polynomial temp = new Polynomial(1);
			for(int i=0; i<p; i++){
				temp = Polynomial.multiply(temp, H);
				//System.out.println(temp);
			}
			temp = Polynomial.multiply(temp, new Polynomial(c));
			result = Polynomial.add(result, temp);
		}
		return result;
	}
	
	public void shiftOx(int move){
		Polynomial shift = Polynomial.add(new Polynomial(), new Polynomial(-move));
		Polynomial temp = Polynomial.compose(this, shift);
		this.h = temp.h;
	}
	
	public void shiftOy(int move){
		Polynomial shift = new Polynomial(move);
		Polynomial temp = add(shift, this);
		this.h = temp.h;
	}
	
	public BigInteger valueAt(long in){
		BigInteger result = BigInteger.ZERO;
		BigInteger temp = BigInteger.ONE;
		int cp = 0;
		for(Map.Entry<Long, BigInteger> e: h.entrySet()){
			int p = e.getKey().intValue();
			BigInteger c = e.getValue();
			temp = temp.multiply(BigInteger.valueOf(in).pow((p-cp)));
			cp = p;
			result = result.add(temp.multiply(c));
		}
		return result;
	}
	

}
