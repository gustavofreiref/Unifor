package com.company;

import java.util.ArrayList;

public class Main {

    public static void main(String[] args) {

        Reader rd = new Reader("/home/beroni/IdeaProjects/Pana/src/com/company/sample.csv");

        System.out.println("Reading data");

        long startTime = System.currentTimeMillis();

        String[] params = rd.getParams();
        ArrayList<ArrayList<String>> allData = rd.getData();

        System.out.println("Read data - Execution time in ms:  " + (System.currentTimeMillis() - startTime) + " ms");
        System.out.println("Finish reading data");

        Solution s = new Solution();

        startTime = System.currentTimeMillis();
        s.questionC(allData,params,1);
        System.out.println("Question C - Execution time in ms:  " + (System.currentTimeMillis() - startTime) + " ms");
        startTime = System.currentTimeMillis();
        s.questionE(allData,params);
        System.out.println("Question E - Execution time in ms:  " + (System.currentTimeMillis() - startTime) + " ms");
        startTime = System.currentTimeMillis();
        s.questionG(allData,params);
        System.out.println("Question G - Execution time in ms:  " + (System.currentTimeMillis() - startTime) + " ms");
        startTime = System.currentTimeMillis();
        s.questionI(allData,params);
        System.out.println("Question I - Execution time in ms:  " + (System.currentTimeMillis() - startTime) + " ms");

    }
}
