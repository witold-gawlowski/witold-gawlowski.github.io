#include <iostream>
#include <algorithm>
#include <cstring>
#include <cstdio>
using namespace std;
const long long MAXN = 220;
const long long INF = 2000000000;
long long n, m;
char miasto1[20];
char miasto2[20];
long long odleglosc;
char miasta[MAXN][20];
long long tab[MAXN][MAXN];
long long min(long long a, long long b){
	if(a<b) return a; 
	return b;
}

void print(){
	for(long long i=0; i<=n; i++){
			printf("%12s", miasta[i]);
		}
		printf("\n");
		for(long long i=1; i<=n; i++){
			printf("%12s", miasta[i]);
			for(long long j=1; j<=n; j++){
				printf("%12lld", tab[i][j]);
			}
			printf("\n");
		}
}
int main(){
	long long Z;
	cin >> Z;
	for(long long z=1; z<=Z; z++){
		scanf("%lld", &n);
		for(long long i=1; i<=n; i++){
			scanf("%s", miasta[i]);
		}
		for(long long i=1; i<=n; i++){
			for(long long j=1; j<=n; j++){
				tab[i][j] = INF;
				if(i==j) 
					tab[i][j] = 0;
			}
		}
		scanf("%lld", &m);
		for(long long i=1; i<=m; i++){
			scanf("%s  %s %lld", miasto1, miasto2, &odleglosc);
			long long m1 = 0;
			long long m2 = 0;
			for(long long i=1; i<=n; i++){
				if(strcmp(miasto1, miasta[i])==0){
					m1 = i;
					break;
				}
			}
			for(long long i=1; i<=n; i++){
				if(strcmp(miasto2, miasta[i])==0){
					m2 = i;
					break;
				}
			}
			tab[m1][m2] = min(tab[m1][m2], odleglosc);
			tab[m2][m1] = min(tab[m2][m1], odleglosc);
		}
	
		
		for(long long k=1; k<=n; k++){
			for(long long i=1; i<=n; i++){
				for(long long j=1; j<=n; j++){

					if(tab[i][k]+tab[k][j] < tab[i][j]){
						tab[i][j] = tab[i][k]+tab[k][j];
					}
				}
			}
		}
		
		print();
	}
	return 0;
}
