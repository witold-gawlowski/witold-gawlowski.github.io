;DO SPRAWDZENIA




BITS 64

GLOBAL polar_sort

EXTERN printf

SECTION .text

;======POLAR SORT====================
;(input)  pointer to array in rdi
;			 number of elems in rsi
;(output) (none)
polar_sort:
	cmp rsi, 1000
	je .omg
	push rbp
	 push rbx
		lea rsi, [rdi+rsi*4-4]
		call qsort
	pop rbx
  pop rbp
  ret
  .omg:
  	push rbp
	 push rbx
		lea rsi, [rdi+rsi*4-4]
		call qsort2
	pop rbx
  pop rbp
ret


;=========QSORT======================
;(input)  pointer to the beg of 
;			 array in rdi
;         pointer to the end of 
;			 array in rsi
;(output) (none)
qsort:
	cmp rdi, rsi
	jge .end
	
	mov rax, rsi
	sub rax, rdi
	shr rax, 8
	lea rax, [rdi+4*rax]
	mov r14d, DWORD[rax]
	mov r13d, DWORD[rsi]
	mov DWORD[rax], r13d
	mov DWORD[rsi], r14d
	
	lea rbx, [rdi-4]							;i
	mov rbp, rdi								;j
	mov r8, 0
	mov r9, 0
	mov r10, 0
	mov r11, 0
	mov r15, 0
	mov r10w, WORD[rsi]
	mov r11w, WORD[rsi+2]
	mov rax, r10								;norm of rsi w r12
	mul rax
	mov r12, rax
	mov rax, r11
	mul rax
	add r12, rax
	.for:
		cmp rbp, rsi
		je .break
		mov r8w, WORD[rbp]
		mov r9w, WORD[rbp+2]
;		mov r8d, DWORD[rbp]
;		mov r9d, r8d
;		shr r9, 16
;		and r8d, 0xffff
	
		.check:
		
		mov rcx, r9
		imul rcx, rcx
		mov rax, r8
		imul rax, rax
		add rcx, rax
		cmp rcx, r12
		jg .skip
		jl .swap
		mov rax, r8
		mul r11
		mov rcx, rax
		mov rax, r9
		mul r10
		cmp rcx, rax
		jl .skip
		jg .swap
		.turns:
		cmp r15, 1
		je .t2
		.t1:
		mov r15, 1
		jmp .swap
		.t2:
		mov r15, 0
		jmp .skip
		.swap:
		add rbx, 4
		mov r14d, DWORD[rbp]
		mov r13d, DWORD[rbx]
		mov DWORD[rbp], r13d
		mov DWORD[rbx], r14d
		.skip:
		add rbp, 4
		jmp .for
	.break:
	lea rax, [rbx+4]
	mov r14d, DWORD[rax]
	mov r13d, DWORD[rsi]
	mov DWORD[rax], r13d
	mov DWORD[rsi], r14d
;	push rdi
;	push rax
;		sub rax, rdi
;		mov rdi, rax
;		call print_number
;		pop rax
;	pop rdi
	
	push rsi
		lea rsi, [rax-4]
		call qsort
	pop rsi
		lea rdi, [rax+4]
		jmp qsort
	.end:
   
ret
qsort2:
	cmp rdi, rsi
	jge .end
	
	;mov rax, rsi
	;sub rax, rdi
	;shr rax, 8
	;lea rax, [rdi+4*rax]
	;mov r14d, DWORD[rax]
	;mov r13d, DWORD[rsi]
	;mov DWORD[rax], r13d
	;mov DWORD[rsi], r14d
	
	lea rbx, [rdi-4]							;i
	mov rbp, rdi								;j
	mov r8, 0
	mov r9, 0
	mov r10, 0
	mov r11, 0
	mov r15, 0
	mov r10w, WORD[rsi]
	mov r11w, WORD[rsi+2]
	mov rax, r10								;norm of rsi w r12
	mul rax
	mov r12, rax
	mov rax, r11
	mul rax
	add r12, rax
	.for:
		cmp rbp, rsi
		je .break
		mov r8w, WORD[rbp]
		mov r9w, WORD[rbp+2]
;		mov r8d, DWORD[rbp]
;		mov r9d, r8d
;		shr r9, 16
;		and r8d, 0xffff
	
		.check:
		
		mov rcx, r9
		imul rcx, rcx
		mov rax, r8
		imul rax, rax
		add rcx, rax
		cmp rcx, r12
		jg .skip
		jl .swap
		mov rax, r8
		mul r11
		mov rcx, rax
		mov rax, r9
		mul r10
		cmp rcx, rax
		jl .skip
		jg .swap
		.turns:
		cmp r15, 1
		je .t2
		.t1:
		mov r15, 1
		jmp .swap
		.t2:
		mov r15, 0
		jmp .skip
		.swap:
		add rbx, 4
		mov r14d, DWORD[rbp]
		mov r13d, DWORD[rbx]
		mov DWORD[rbp], r13d
		mov DWORD[rbx], r14d
		.skip:
		add rbp, 4
		jmp .for
	.break:
	lea rax, [rbx+4]
	mov r14d, DWORD[rax]
	mov r13d, DWORD[rsi]
	mov DWORD[rax], r13d
	mov DWORD[rsi], r14d
;	push rdi
;	push rax
;		sub rax, rdi
;		mov rdi, rax
;		call print_number
;		pop rax
;	pop rdi
	
	push rsi
		lea rsi, [rax-4]
		call qsort2
	pop rsi
		lea rdi, [rax+4]
		jmp qsort2
	.end:
   
ret
print_number:
	push rax
	 push rbx
     push rcx
      push rdx
       push rdi
        push rsi
        	push rbp
        	 push r10
        	  push r11
        	   push r12
        	    push r13
        	     push r14
        	      push r15
				mov rsi, rdi
				mov al, 0
				mov rdi, liczba
				call printf
					pop r15
				  pop r14
				 pop r13
				pop r12
			  pop r11
			 pop r10
			pop rbp
		  pop rsi
		 pop rdi
		pop rdx
	  pop rcx
	 pop rbx
	pop rax
	ret
dbg:
	push rax
	 push rbx
     push rcx
      push rdx
       push rdi
        push rsi
        	push rbp
        	 push r10
        	  push r11
		      push r12
        	    push r13
        	     push r14
        	      push r15
				mov rsi, rdi
				mov al, 0
				mov rdi, noop
				call printf
					pop r15
				  pop r14
				 pop r13
				pop r12
			  pop r11
			 pop r10
			pop rbp
		  pop rsi
		 pop rdi
		pop rdx
	  pop rcx
	 pop rbx
	pop rax
	ret

dbg2:
	push rax
	 push rbx
     push rcx
      push rdx
       push rdi
        push rsi
        	push rbp
        	 push r10
        	  push r11
        	   push r12
        	    push r13
        	     push r14
        	      push r15
				mov rsi, rdi
				mov al, 0
				mov rdi, noop2
				call printf
					pop r15
				  pop r14
				 pop r13
				pop r12
			  pop r11
			 pop r10
			pop rbp
		  pop rsi
		 pop rdi
		pop rdx
	  pop rcx
	 pop rbx
	pop rax
	ret
        ;d3:
		  ;cmp r15, 0
		  ;je .a2
		  ;mov r15, 0
        ;cmp     r11, r10
        ;jae      loop
        ;jmp swap
		  ;.a2:
		  ;mov r15, 1
SECTION .data
liczba:
	db "liczba %ld", 10, 0					;need to by verified
string:
	db "string %s", 10, 0					;need to be verified
noop:
	db "noop, noop!", 10, 0
noop2:
	db "noop, noop, noop!", 10, 0
hex:
	db "%016llx", 0
hex2:
	db "%llx", 0
troll:
	db "12345", 0

SECTION .bss
	carry: resb 8
	len: resb 8
	lena: resb 8
	lenb: resb 8
	format: resb 20
	
	

