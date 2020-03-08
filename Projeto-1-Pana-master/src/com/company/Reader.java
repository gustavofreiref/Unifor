package com.company;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

public class Reader {

    private String filename;

    public Reader(String filename){
        this.filename = filename;
    }

    public String[] getParams(){
        FileReader file;
        String row = null;
        try {
            file = new FileReader(new File(this.filename));
            BufferedReader br = new BufferedReader(file);
            row = br.readLine();
        }catch (IOException e){
            e.printStackTrace();
        }
        return row.split(" ");
    }


    public void showData(ArrayList<ArrayList<String>> data ){

        data.stream().flatMap(Collection::stream).forEach(System.out::println);

    }

    public ArrayList<ArrayList<String>> getData(){
        FileReader file;
        ArrayList<ArrayList<String>> alldData = new ArrayList<ArrayList<String>>();
        try{
            file = new FileReader(new File(this.filename));
            BufferedReader br = new BufferedReader(file);
            String row;
            row = br.readLine();
            while ((row = br.readLine()) != null){
                ArrayList<String>  rowObj = new ArrayList<String>();
                String[] data = row.split(" ");

                for (int i = 0; i< data.length ; i ++){
                    rowObj.add(data[i]);
                }
                alldData.add(rowObj);
            }
        }catch (IOException e){
            e.printStackTrace();
        }
        return alldData;
    }


}
