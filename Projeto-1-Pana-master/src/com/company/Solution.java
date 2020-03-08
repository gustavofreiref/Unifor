package com.company;

import java.util.ArrayList;

public class Solution {

    // c) Criar uma função eficiente que retorna o contrato de menor valor de um dado fornecedor. (1,0 ponto)
    public void questionC(ArrayList<ArrayList<String>> d , String[] params,Integer provider) {
        int providersSize = Integer.parseInt(params[1]);

        ArrayList<ArrayList<String>> data = (ArrayList<ArrayList<String>>) d.clone();

        if (provider > providersSize && provider <= 0){
            System.out.println("Nao pode colocar valores menores igual ");
        }
        float menor = Float.POSITIVE_INFINITY;

        data.removeIf(n -> Integer.valueOf(n.get(0)) != provider); // n

        for (int i = 0 ; i< data.size(); i++){
            float valor = Float.valueOf(data.get(i).get(3));
            if(menor > valor){
                menor = valor;
            }
        }
        System.out.println("O menor valor do provedor " +provider + " é " + menor);
    }

    // e) Criar uma função eficiente que retorna o contrato de menor valor do mercado. (1,0 ponto)
    public void questionE(ArrayList<ArrayList<String>> d , String[] params) {

        ArrayList<ArrayList<String>> data = (ArrayList<ArrayList<String>>) d.clone();

        float menor = Float.POSITIVE_INFINITY;

        for (int i = 0 ; i< data.size(); i++){
            float valor = Float.valueOf(data.get(i).get(3));
            if(menor > valor){
                menor = valor;
            }
        }

        System.out.println("O menor valor é " + menor);

    }
   // g) Criar uma função eficiente que retorna o contrato de menor valor referente ao período completo do mês 1 ao mês n. (1,0 ponto)
    public void questionG(ArrayList<ArrayList<String>> d , String[] params){

        ArrayList<ArrayList<String>> data = (ArrayList<ArrayList<String>>) d.clone();

        float menor = Float.POSITIVE_INFINITY;

        data.removeIf(a -> Integer.valueOf(a.get(1)) != 1);// n
        data.removeIf(a -> Integer.valueOf(a.get(2)) != Integer.valueOf(params[0]));// n

        for (int i = 0 ; i< data.size(); i++){
            float valor = Float.valueOf(data.get(i).get(3));
            if(menor > valor){
                menor = valor;
            }
        }
        System.out.println("O menor valor do período 1 ao mês "+ Integer.valueOf(params[0]) + " é "+ menor);

    }
   // i) Criar uma função que sugere quais contratos de energia devem ser contratados para os próximos n meses. (1,0 ponto)
    public void questionI(ArrayList<ArrayList<String>> data , String[] params){

    }

}
