
package main
import "fmt"
// import "sync"
import "github.com/rewardStyle/kinetic"
func main() {
    fmt.Println("hello world")

    producer, _ := new(kinetic.Producer).InitC("kclnodejsclickstreamsamplex", "0", "LATEST", "AKIAJ4PP5GCSSJ4JLIMA", "lc0dxUCixIfvtNAjlBGduShIljsN7a2WFaOJSMUr", "eu-west-1", 10)

    println("start send.............")
	producer.Send(new(kinetic.Message).Init([]byte(`{"foo":"bar"}`), "test"))
	producer.Send(new(kinetic.Message).Init([]byte(`{"test":"kul"}`), "test"))
	println("end send.............")


	println("start listener.............")
    listener, _ := new(kinetic.Listener).InitC("kclnodejsclickstreamsamplex", "0", "LATEST", "AKIAJ4PP5GCSSJ4JLIMA", "lc0dxUCixIfvtNAjlBGduShIljsN7a2WFaOJSMUr", "eu-west-1", 4)
 //    go listener.Listen(func(msg []byte, wg *sync.WaitGroup) {
 //    	println(string(msg))
 //    	wg.Done()
	// })

	msg, err := listener.Retrieve()
	if err != nil {	
    	println(err)
	}

	println(string(msg.Value()))

	println("end listener.............")

	listener.Close()
    producer.Close()

}
