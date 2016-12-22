import java.util.AbstractMap;
import java.util.AbstractSet;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;


public class ListIsFunction {
	List list = new ArrayList();
	public List asList(){
		return list;
	}
	
	public Map asMap(){
		return new AbstractMap(){
			@Override
			public Object put(Object key, Object value){
				int k = (int)key;
				if(k > list.size()||k<0)
					throw new IllegalArgumentException();
				if(k==list.size()){
					list.add(value);
					return null;
				}
				return list.set(k, value);
			}
		

			@Override 
			public Object remove(Object key){
				int k = (int)key;
				if(k==list.size()-1)
					return list.remove(k);
				if(k>=0&&k<list.size()-1)
					throw new IllegalArgumentException();
				return null;
			}
			
			@Override
			public Set entrySet() {
				return new AbstractSet(){

					@Override
					public Iterator iterator() {
						return new Iterator(){
							boolean removed = false;
							int i=0;
							@Override
							public boolean hasNext() {
								return i<list.size();
							}

							@SuppressWarnings("unchecked")
							@Override
							public Object next() {
								if(i==list.size())
									throw new NoSuchElementException();
								removed = false;
								final int j = i++;
								return new AbstractMap.SimpleEntry(j, list.get(j)){
									@Override
									public Object setValue(Object value){
										return list.set(j, value);
									}
									@Override

									public Object getValue(){
										return list.get(j);
									}
									@Override

									public Object getKey(){
										return j;
									}
								};
							}

							@Override
							public void remove() {
								if(removed)
									throw new IllegalStateException();
								if(i<list.size())
									throw new IllegalStateException();
								list.remove(i-1);
								removed = true;
							}
							
						};
					}

					@Override
					public int size() {
						return list.size();
					}

					
					
				};
			}
			
		};
	}
}
