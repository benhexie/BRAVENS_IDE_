#include<iostream>
using namespace std;
class Triangle{
    public:
        int base;
        int height;
        int area;
        Triangle(){
            base = 4;
            height = 6;
        }
        void triarea(){
            area = 0.5*base*height;
            cout<<area;
        }
};
int main(){
Triangle newTriangle;
newTriangle.triarea();
}