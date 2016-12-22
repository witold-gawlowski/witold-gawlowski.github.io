#include <cstdio>
#include <cstring>
#include <vector>
#include <iostream>
using namespace std;
const int MAX = 1000100;
char buff[MAX];
char tab[2*MAX];
int parz[MAX];
int nparz[MAX];
int Z;
int q;
int n;
int a, b;
int P[2*MAX];


void palRad(const char *x, bool p, int *r){
	int n = strlen(x), i = 1, j = 0, k;
	while(i < n){
		while(i+j+p <n && i > j && x[i - j -1] == x[i+j+p]) j++;
		for(r[i] = j, k=0; ++k <=j && r[i-k] !=j-k;)
			r[i+k] = min(r[i-k], j-k);
		j = max(0, j-k);
		i+=k;
	}
	return;
}
	

int main(){
	scanf("%d", &Z);

	for(int z=0; z<Z; z++){
		scanf("%s", buff);
		n = strlen(buff);
		for(int i=0; i<n; i++){
			parz[i] = 0;
			nparz[i] = 0;
		}
		scanf("%d", &q);
		palRad(buff, 0, parz);
		palRad(buff, 1, nparz);
		for(int zz=0; zz<q; zz++){
			scanf("%d %d", &a, &b);
			a--; b--;
			if((b-a)%2==0){
				if(nparz[(a+b)/2]>=(b-a)/2)
					printf("TAK\n");
				else
					printf("NIE\n");
			}else{
				if(parz[(a+b+1)/2]>=(b-a+1)/2)
					printf("TAK\n");
				else
					printf("NIE\n");
			}
		
		}
	}
return 0;
}
