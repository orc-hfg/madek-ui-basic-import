import { ref } from "vue"

export const errorHelper = () => {

    const error_msg = ref('')

    const handle_error = (msg:string, error:any) => {
        const mmsg = 'ERROR: ' + msg + ' error: ' + JSON.stringify(error)
        console.error(mmsg)
        error_msg.value = mmsg
    }

    const handle_http_error = (msg:string, error:Response) => {
        const mmsg = 'ERROR: ' + msg + ' status: ' + error.status
        console.error(mmsg)
        error_msg.value = mmsg
    }

    const reset_error = () => { error_msg.value = '' }


    return {
        error_msg,
        handle_error,
        handle_http_error,
        reset_error

    }
}