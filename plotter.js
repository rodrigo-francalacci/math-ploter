
        
//==============================================================================   
//-----------------------------inicia o script---------------------------------
//inputs são: X mínimo e máximo da escala, Y mínimo e máximo da escala,
// se vai desenhar os números no grid, ou se vai desenhar os números do fim e início das funções
function draw(config, funcs) {
    
    var Xmin = config.Xmin;
    var Xmax = config.Xmax;
    var Ymin = config.Ymin;
    var Ymax = config.Ymax;
    var numeroGrid = config.No_grid;
    var numeroPares = config.No_pares;
    var pares = funcs[0];
    
    

    //-------------------------acessa o canvas no html--------------------------
    var canvas = document.getElementById("canvas");
    if (null==canvas || !canvas.getContext) return;
    var axes={}, ctx=canvas.getContext("2d");
    
    //==========================================================================
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //-----------------------------prepara escala-------------------------------
    var p = gcd(Xmax-Xmin,Ymax-Ymin); // em quantas partes vai dividir os grids
    p = p*config.ScaleDivisions;
    var Ux = (Xmax-Xmin)/p; //fator de multiplicação do eixo X
    var Uy = ((Ymax-Ymin)/p); //fator de multiplicação do eixo Y
    //==========================================================================
    
     
    //------------------------------mostra os eixos-----------------------------
    var Xd=0;
    var Yd=0;
    if(Xmin<0){Xd=(Math.abs(Xmin))/(Xmax-Xmin)};
    if(Ymin<0){Yd=(Math.abs(Ymin))/(Ymax-Ymin)};
    axes.x0 = 50 + Xd*canvas.width;  // x0 pixels from left to x=0
    axes.y0 = -50 + (1-Yd)*canvas.height; // y0 pixels from top to y=0
    
    p=1/(p*1.3);
    showAxes(ctx, axes, p, Ux, Uy, numeroGrid, config); // tamanho dos grids em função da largura
    //==========================================================================
    
    
    //-------------traça pontilhados e os pares de pontos selecionados----------
    if(numeroPares==true){
    var scalaX = (p*canvas.width)/Ux;
    var scalaY = (p*canvas.width)/Uy;
    //var pares = setarParesDePontos();
    tracarPontilhados(ctx, axes, pares, scalaX, scalaY, config);   
    }
    //==========================================================================
    
    
    //-----------------------------desenha as funções---------------------------
   // desenharFuncoes(ctx,axes,p,Ux,Uy);
    var n = 0;
    for(n=1; n<=funcs.length; n++){
    funGraph(ctx, axes, funcs[n].fun, p, Ux, Uy, funcs[n].xmin, funcs[n].xmax, funcs[n].lineColor, funcs[n].espessura);
    }
    
    
    
    
    //==========================================================================
    
}
//==============================================================================
     
        
//------------------------------mostra os eixos---------------------------------
function showAxes(ctx, axes, p, Ux, Uy, gridData, config){ //onde p é a porcentagem da largura total que terá cada grid
    
     var x0=axes.x0, w=ctx.canvas.width;
     var y0=axes.y0, h=ctx.canvas.height;
     var t = w/100; //tanho do marcador dos números nos eixos
     ctx.beginPath();
     ctx.strokeStyle = "rgb(0,0,0)";
     ctx.lineWidth = config.axisWidth;
     ctx.font = config.font;
     
    
     //traça eixo X
     ctx.moveTo(0,y0); ctx.lineTo(w, y0); //traça a reta
     ctx.moveTo(w-1,y0); ctx.lineTo(w-1-t,y0-t); ctx.moveTo(w-1,y0); ctx.lineTo(w-1-t,y0+t); //traça a ponta de seta
     ctx.fillText(config.rotuloX ,w-(config.rotuloXdes*t),y0+t+40); //escreve o rótulo

    
    
    if(gridData==true){
                //traça os grids do eixo X da origem sentido lado positivo
        var i = 0;
        while (i*p*w < (w-x0)){
        ctx.moveTo(x0+(i*p*w), y0+t); ctx.lineTo(x0+(i*p*w),y0-t);   
        if (i != 0) {ctx.fillText(i*Ux, x0+(i*p*w-4), y0+t+15 );}
        i++;
        }
    
        i = 0;
        while (i*p*w < x0){
        ctx.moveTo(x0-(i*p*w), y0+t); ctx.lineTo(x0-(i*p*w),y0-t);
        if (i != 0) {ctx.fillText(-i*Ux, x0-(i*p*w+10), y0+t+15);}
        i++;
        }
    }

        
    
     //traça o eixo Y
     ctx.moveTo(x0,0); ctx.lineTo(x0,h); //traça o eixo Y
     ctx.moveTo(x0,1); ctx.lineTo(x0-t,1+t); ctx.moveTo(x0,1); ctx.lineTo(x0+t,1+t); //traça a ponta de seta
     ctx.fillText(config.rotuloY ,x0+(3*t),t+10); //escreve o rótulo
    
    if(gridData==true){
       var i = 0;
        var des = 0;
        while (i*p*w < (h-y0)){
        ctx.moveTo(x0+t, y0+(i*p*w)); ctx.lineTo(x0-t,y0+(i*p*w));  
        if (i != 0) {
            
            switch((i*Uy).toString().length) {
                  case 1:
                    des=15;
                    break;
                  case 2:
                    des=25;
                    break;
                  case 3:
                    des=35;
                    break;
                  case 4:
                    des=45;
                    break;
                  case 5:
                    des=55;
                    break;
                }
            
            ctx.fillText(-i*Uy,x0-t-des,y0+(i*p*w+6))
        }
        i++;
        }
    
        i = 0;
        while (i*p*w < y0){
        ctx.moveTo(x0+t, y0-(i*p*w)); ctx.lineTo(x0-t,y0-(i*p*w)); 
        if (i != 0) {
            
            switch((i*Uy).toString().length) {
                  case 1:
                    des=10;
                    break;
                  case 2:
                    des=20;
                    break;
                  case 3:
                    des=30;
                    break;
                  case 4:
                    des=40;
                    break;
                  case 5:
                    des=50;
                    break;
                }
            
            ctx.fillText(i*Uy,x0-t-des,y0-(i*p*w-6))
        
        
        }; 
    i++;
    }
    
        
        
        } //finaliza ifGridData = true para o eixo y
    

     ctx.stroke();
    
      
    
}
//==============================================================================

        
//-------------traça pontilhados e os pares de pontos selecionados--------------
function tracarPontilhados(ctx, axes, pares, scalaX, scalaY, config){

var x0=axes.x0; 
var y0=axes.y0; 
var w=ctx.canvas.width;
var h=ctx.canvas.height;
var r=config.r;
var t = w/100;
var i = 0;
var x = 0;
var y = 0;

    

        //-----------------------começa a varrer todos os pares ---------------------------
        var des;
        var n;
        var x00;
        var jaTem = false;
        for (i=0; i <= pares.length-1; i++){
  

        x=pares[i][0];
        y=pares[i][1];

        x=x0+(x*scalaX);
        y=y0-(y*scalaY);


        ctx.beginPath();
        ctx.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
        ctx.strokeStyle = "rgb(160,160,160)";
        ctx.lineWidth = 2;
        ctx.font = config.font;

                //-------------------------traça a linha horizontal--------------------------------
                ctx.moveTo(x, y);

                x00=x0;
                for(n=0; n<i; n++){
                    if (pares[i][1]==pares[n][1]){x00=x0+(pares[n][0]*scalaX);};
                }

                if(y!=y0){ctx.lineTo(x00,y);} //esse if evita de traçar a linha tracejada encima o eixo X



                //verifica se aquele ponto Y já foi colocado e coloca ele na legenda
                jaTem = false;
                for(n=0; n<i; n++){
                    if (pares[i][1]==pares[n][1]){
                    jaTem = true;
                    };
                }

                if(jaTem==false){

                  switch(pares[i][1].toString().length) {
                                  case 1:
                                    des=15;
                                    break;
                                  case 2:
                                    des=25;
                                    break;
                                  case 3:
                                    des=35;
                                    break;
                                  case 4:
                                    des=45;
                                    break;
                                  case 5:
                                    des=55;
                                    break;
                                }   

                    ctx.fillText(pares[i][1],x0-t-des+r,y+6);


                }



                //----------------------------traça a linha vertical----------------------------

                if(x!=x0){ //para evitar traçar encima do eixo
                ctx.moveTo(x, y);
                ctx.lineTo(x,y0);   
                }

                if(pares[i][0]==0){ctx.fillText(pares[i][0],x-t-10,y0+20);} else{

                  switch(pares[i][0].toString().length) {
                                  case 1:
                                    des=0;
                                    break;
                                  case 2:
                                    des=6;
                                    break;
                                  case 3:
                                    des=12;
                                    break;
                                  case 4:
                                    des=18;
                                    break;
                                  case 5:
                                    des=24;
                                    break;
                                }
                ctx.fillText(pares[i][0],x-t-des,y0+20);
                }


                
        ctx.stroke(); 
        } //finaliza esse par...

  
} 
//==============================================================================
        
        
//-----------------------------desenha a função--------------------------------- 
function funGraph(ctx, axes, func, p, Ux, Uy, minX, maxX, color, thick){
     var x0=axes.x0; 
     var y0=axes.y0; 
     var w=ctx.canvas.width;
     var h=ctx.canvas.height;
     var xx=0;
     var yy=0;
     var u=0;
     

var u = p*w; //calcula o tamanho de cada unidade do grid
    

//define da onde parte a função, de qual valor de X e Y
xx=minX;
var minY = func(minX);
ctx.beginPath();
ctx.setLineDash([]);
ctx.lineWidth = thick;
ctx.strokeStyle = color;
yy=func(xx);
ctx.moveTo(x0+(xx*u/Ux),y0-(yy*u/Uy)); //onde inicia o dominio da função


//define até qual X e Y vai a função
var maxY = func(maxX);
   
//plota a parte positiva da função função
xx=minX;
while(xx < maxX){
xx;
yy=func(xx);
ctx.lineTo(x0+(xx*u/Ux),y0-(yy*u/Uy));
xx=xx+(Ux/u);
}
  
 ctx.stroke();    
  
}
//==============================================================================

        
//-------------------------calcula o máximo divisor comum----------------------- 
var gcd = function(a, b) {
    if (b == 0) {
        return a;
    }
return gcd(b, a % b);
};
//==============================================================================
        
