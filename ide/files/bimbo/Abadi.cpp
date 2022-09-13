#include<iostream>
using namespace std;
class Father{
    public:
        int height;
        string color;
        string shape;
       Father(){
           height = 6.7;
           color = "grey";
           shape = "round";
       }
       void screem(){
           cout<<"I am a fucking extrovert!!!\n";
       }
};
class Son1:public Father{};
class Son2:public Father{};

int main(){
    
    Son1 son1;
    Son2 son2;
    
    son1.screem();
    son2.screem();
    
    return 0;
}