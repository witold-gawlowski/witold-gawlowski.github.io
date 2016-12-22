#include <cstdio>
#include <iostream>
#include <algorithm>
using namespace std;
const int MAX = 110;
const int INFINITY = 2000000001;
int n;
int C[MAX][MAX];
int dist[MAX];
int Q[2<<23];//ile to jest
int bfs(int s, int t){
	for(int i=0; i<n; i++)
		dist[i] = -1;
	dist[s] = 0;
	int beg = 0;
	int end = 0;
	Q[end] = s; end++;
	while(beg!=end){
		int u = Q[beg];
		beg++;
		for(int i=0; i<n; i++)
			if(C[u][i]>0&&dist[i]==-1){
				dist[i] = dist[u]+1;
				Q[end] = i; end++;
			}
	}
	if(dist[t]==-1)
		return 0;
	return 1;
}
void print(){
	for(int i=0; i<n; i++){
		for(int j=0; j<n; j++)
			cout << C[i][j] << " ";
		cout << endl;
	}
	cout << endl;
}

int dfs(int s, int t, int bNeck){
	int result = 0;
	if(bNeck==0)
		while(1);
	if(s==t)
		return bNeck;
	for(int i=0; i<n; i++){
		if(dist[i]==dist[s]+1&&C[s][i]>0){
			int y = dfs(i, t, min(bNeck, C[s][i]));
			result+=y;
			C[s][i]-=y; C[i][s]+=y;
			bNeck-=y;
			if(bNeck==0)
				break;
		}
	}
	return result;
}
int flow(int s, int t){
	int result = 0;
	while(bfs(s, t)){
		//print();
		result+=dfs(s, t, INFINITY);
	}
	return result;
}
int main(){
	int Z;
	scanf("%d", &Z);
	for(int zz=1; zz<=Z; zz++){
		scanf("%d", &n);
		for(int i=0; i<n; i++)
			for(int j=0; j<n; j++){
				scanf("%d", &C[i][j]);
			}
		printf("%d\n", flow(0, n-1));
	}
	return 0;
}
