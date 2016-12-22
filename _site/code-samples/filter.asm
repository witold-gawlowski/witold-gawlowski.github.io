BITS 64 

SECTION .text

GLOBAL filter

 %macro m9 1
  pxor xmm%1, xmm%1
  pinsrd xmm%1, eax, 0
  pinsrd xmm%1, eax, 1
  pinsrd xmm%1, eax, 2
  pinsrd xmm%1, eax, 3
 %endmacro

extern printf, malloc, free, calloc

;rdi - pointer to dst
;rsi - pointer to src
;rdx - pointer to matrix
;============FILTER function===================
filter:
push	rbx
push	r12
push	r13
push	r14
push	r15
 mov r8, 9259542123273814018	;setting shuffle pattern 
 mov r9, 9259541577812967424
 movq xmm1, r8
 movq xmm4, r9
 movlhps xmm4, xmm1
 
 pxor xmm6, xmm6		;prepare xmm6
 mov r8, 255			;prepare xmm5
 mov r9, r8
 shl r9, 32
 or r8, r9
 movq xmm5, r8
 movlhps xmm5, xmm5


;============preproc=======================
;picture + frame size in new_size
;width in width, height in height
;matrix in xmm7-xmm15
;shuffle patterns in xmm4, xmm5, xmm6
;(min and max bounds in xmm3, xmm2)
;(filter result in xmm0)
 mov rax, 0
 mov eax, DWORD[rdi+8]
 add rax, 2
 mov rbx, 0
 mov ebx, DWORD[rdi+12]
 add rbx, 2
 imul rax, rbx
 imul rax, 3
 mov [new_size], rax

 mov rbx, 0
 mov ebx, DWORD[rdi+8]
 mov [width], rbx
 imul rbx, 3
 mov [width3], rbx
 mov ebx, DWORD[rdi+12]
 mov [height], rbx
 imul rbx, 3
 mov [height3], rbx


 ;===preparing matrix registers=====
 mov rax, 0
 
 mov eax, DWORD[rdx]
 m9 7
 
 mov eax, DWORD[rdx+4]
 m9 8
 
 mov eax, DWORD[rdx+8]
 m9 9
 
 mov eax, DWORD[rdx+12]
 m9 10

 mov eax, DWORD[rdx+16]
 m9 11
 
 mov eax, DWORD[rdx+20]
 m9 12
 
 mov eax, DWORD[rdx+24]
 m9 13
 
 mov eax, DWORD[rdx+28]
 m9 14
 
 mov eax, DWORD[rdx+32]
 m9 15

 pxor xmm0, xmm0
;=========prepare new space=================
;pointer to new space in rcx
;
 push rdx
 push rdi
 push rsi
 mov rdi, [new_size]
 mov rsi, 1
 call calloc
 mov rcx, rax
 pop rsi
 pop rdi
 pop rdx
;==========add frame========================
 mov rax, 0
 frame_outer:
  cmp rax, [height]
  jge break_frame_outer
  mov r8, rax           ;row begginig
  add r8, 1
  mov r15, [width]
  add r15, 2
  imul r8, r15
  add r8, 1
  imul r8, 3
  add r8, rcx

  mov rbx, 0
  frame_inner:
   cmp rbx, [width3]
   jge break_frame_inner
   
   mov r14, [width3]    ;byte to copy in r14b
   imul r14, rax
   add r14, rbx
   add r14, [rsi]
   mov r14b, BYTE[r14]
   
   mov r15, r8          ;copying to framed pctr
   add r15, rbx
   mov BYTE[r15], r14b
   
   inc rbx
   jmp frame_inner
  break_frame_inner:
  inc rax
  jmp frame_outer
 break_frame_outer:
 
;===================filter============================
mov r10, [height]
mov r11, [width]

 mov rax, 0
 fil_outer:
  cmp rax, r10
  jge break_fil_outer
  
  mov rbx, 0
  fil_inner:
   cmp rbx, r11
   jge break_fil_inner

   mov r8, rax
   add r8, 1
   mov r9, r11
   add r9, 2
   imul r8, r9
   add r8, 1
   add r8, rbx
   imul r8, 3
   ;===============do stuff========================
   add r8, rcx
   lea r9, [3*r11+6]
   sub r8, r9
   sub r8, 3
   lddqu xmm1, [r8]
pxor xmm0,xmm0
cvtdq2ps xmm0,xmm0
   
  movdqa xmm2, xmm1
  pshufb xmm2, xmm4
  cvtdq2ps xmm2, xmm2
  mulps xmm2, xmm7
  addps xmm0, xmm2
   
   movdqa xmm2, xmm1
   palignr xmm2, xmm2, 3
   pshufb xmm2, xmm4
   cvtdq2ps xmm2, xmm2
   mulps xmm2, xmm8
   addps xmm0, xmm2
   
   movdqa xmm2, xmm1
   palignr xmm2, xmm2, 6
   pshufb xmm2, xmm4
   cvtdq2ps xmm2, xmm2
   mulps xmm2, xmm9
   addps xmm0, xmm2
   
   add r8, r9
   lddqu xmm1, [r8]
   
   movdqa xmm2, xmm1
  pshufb xmm2, xmm4
  cvtdq2ps xmm2, xmm2
  mulps xmm2, xmm10
  addps xmm0, xmm2
   
   movdqa xmm2, xmm1
   palignr xmm2, xmm2, 3
   pshufb xmm2, xmm4
   cvtdq2ps xmm2, xmm2
   mulps xmm2, xmm11
   addps xmm0, xmm2
   
   movdqa xmm2, xmm1
   palignr xmm2, xmm2, 6
   pshufb xmm2, xmm4
   cvtdq2ps xmm2, xmm2
   mulps xmm2, xmm12
   addps xmm0, xmm2
   
       add r8, r9
   lddqu xmm1, [r8]
   
   movdqa xmm2, xmm1
  pshufb xmm2, xmm4
  cvtdq2ps xmm2, xmm2
  mulps xmm2, xmm13
  addps xmm0, xmm2
   
   movdqa xmm2, xmm1
   palignr xmm2, xmm2, 3
   pshufb xmm2, xmm4
   cvtdq2ps xmm2, xmm2
   mulps xmm2, xmm14
   addps xmm0, xmm2
   
   movdqa xmm2, xmm1
   palignr xmm2, xmm2, 6
   pshufb xmm2, xmm4
   cvtdq2ps xmm2, xmm2
   mulps xmm2, xmm15
   addps xmm0, xmm2
 
   ;=====extraxt result from xmm0===================
   cvtps2dq xmm0, xmm0          ;trimming, (should i round to nearest)
   ;maxps xmm0, xmm6
   ;minps xmm0, xmm5
packusdw xmm0,xmm0
packuswb xmm0,xmm0
   
   
   
   
   mov r8, r11
   imul r8, rax
   add r8, rbx
   imul r8, 3
  
   mov r9, [rdi]
   add r9, r8
 movd dword[r9],xmm0  
  
   
   inc rbx
   jmp fil_inner
  break_fil_inner:

  inc rax
  jmp fil_outer
 break_fil_outer:


;=============freeing help-space and returing==============
mov rdi, rcx
call free
pop		r15
pop		r14
pop		r13
pop		r12
pop		rbx
ret 

dbg:
 push rax
 push rsi
 push rdi

 mov rdi, dot
 mov al, 0
 call printf

 pop rdi
 pop rsi
 pop rax
ret

num:
 push rax
 push rsi
 push rdi
 push r8

 mov rsi, rdi
 mov al, 0
 mov rdi, number_format
 call printf

 pop r8
 pop rdi
 pop rsi
 pop rax
ret

flo:
push rax
push rsi
push rdi

mov rsi, rdi
mov al, 0
mov rdi, float_format
call printf

pop rdi
pop rsi
pop rax
ret

SECTION .bss
 tmp: resb 8
 width: resb 8
 width3: resb 8
 height: resb 8
 height3: resb 8
 new_size: resb 8
SECTION .data
dot:
 db ".", 10, 0
number_format:
 db "printed number: %llu", 10, 0
float_format:
 db "printed float: %f", 10, 0