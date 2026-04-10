#include <stdio.h> 
 
void func(int i, int j) { 
  if(i < j) { 
    int i = 0; 
    while (i < 10) { 
      j += 2;  
      i++; 
    } 
  } 
  printf("%d", i); 
} 
int main() { 
  int i = 9, j = 10; 
  func(i, j); 
  return 0; 
} 