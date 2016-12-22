import java.util.HashMap;
import java.util.Map;
import java.io.Reader;
import java.util.Scanner;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.locks.ReentrantLock;

public class Relay {
    Reader reader;
    Map<Integer, Thread> runners;
    volatile boolean endOfInput;
    ReentrantLock relayLock;
    ConcurrentLinkedQueue<Thread> queue;

    public Relay(Reader reader){
        this.reader = reader;
        relayLock = new ReentrantLock();
        endOfInput = false;
        queue = new ConcurrentLinkedQueue<Thread>();
        runners = new HashMap<Integer, Thread>();
    }

    public void register(int id, Thread competitor){
        runners.put(id, competitor);
    }
    public void startRelayRace(){
        new Thread(){
            public void run(){
                Scanner scanner = new Scanner(reader);
                while(scanner.hasNextInt()){
                    synchronized (Relay.this){
                        Integer temp = scanner.nextInt();
                            queue.add(runners.get(temp));
                            Relay.this.notifyAll();
                    }
                    Thread.yield();
                }

                synchronized (Relay.this) {
                    endOfInput = true;
                    Relay.this.notifyAll();
                }
            }
        }.start();
    }

    public synchronized boolean dispatch(){
            if(relayLock.isHeldByCurrentThread()){
                relayLock.unlock();
                notifyAll();
            }

            while (true) {
                if(endOfInput&&queue.isEmpty())
                    return false;

                if(!queue.isEmpty()&&queue.peek().equals(Thread.currentThread())){
                    if(relayLock.tryLock()) {
                        queue.remove();
                        break;
                    }
                }

                try {
                    //System.out.printf("<"+Thread.currentThread().getId());
                    Relay.this.wait();
                    //System.out.println(Thread.currentThread().getId()+">");
                } catch (InterruptedException e) {
                    System.out.printf("NEVER HERE");
                }
            }
        return true;
    }
}
