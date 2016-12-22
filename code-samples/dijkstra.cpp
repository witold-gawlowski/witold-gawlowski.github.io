#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
#include <cstdlib>
#include <cstdio>
using namespace std;
#define ST first
#define ND second
const int MAX = 50005;
const int INF = 2000000000;
vector<pair<int, int> > ts[MAX];

int dist[MAX];
int tempa, tempb, tempk;
int n, m;

class Prioritize{
	public:
	bool operator()(const pair<int, int>& t1,const pair<int, int>& t2){
		return t1 > t2;
	}
};

priority_queue <pair<int, int >, vector <pair<int, int > >, Prioritize >  Q;

void init(){
	dist[1] = 0;
	for(int i=2; i<=n; i++){
		dist[i] = INF;
	}	
}

void djikstra(){
	pair<int, int> temp;
	temp.ST = 0;
	temp.ND = 1;
	Q.push(temp);
	while(!Q.empty()){
		temp = Q.top();
		Q.pop();
		int distance = temp.ST;
		int u = temp.ND;
		//cout << distance << endl;
		if(distance>dist[u])
			continue;
		for(int i=0; i<ts[u].size(); i++){
			int v = ts[u][i].ST;	
			int edgeLen = ts[u][i].ND;
			int newLen = dist[u] + edgeLen;
			if(dist[v] > newLen){
				temp.ST = newLen;
				temp.ND = v;
				Q.push(temp);
				dist[v] = newLen;
			}
		}
	}
}
int main(){
   int Z;
   scanf("%d", &Z);
   for(int z=1; z<=Z; z++){
		scanf("%d %d", &n, &m);
		for(int i=1; i<=n; i++){
			ts[i].clear();
		}
		for(int j=1; j<=m; j++){
			scanf("%d %d %d", &tempa, &tempb, &tempk);
			pair<int, int> tempPair;
			tempPair.ST = tempb;
			tempPair.ND = tempk;
			ts[tempa].push_back(tempPair);
		}
		init();
		djikstra();
		if(dist[n]==INF){
			printf("BRAK\n");
			continue;
		}
		for(int i=n; i<=n; i++){
			printf("%d ", dist[i]);
		}
		printf("\n");
   }
   return 0;
}
