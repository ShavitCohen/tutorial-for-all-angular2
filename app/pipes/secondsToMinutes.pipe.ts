import {Pipe,PipeTransform} from 'angular2/core';


@Pipe({name: 'secondsToMinutes'})
export class SecondsToMinutesPipe implements PipeTransform{
    transform(time) : string{
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
        let hours = Math.floor(time / 3600);
        time = time - hours * 3600;
        function str_pad_left(string,pad,length) {
           return (new Array(length+1).join(pad)+string).slice(-length);
        }

        return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);;
    }
}