import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(text: string, search): string {
    var pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    pattern = pattern.split(' ').filter((t) => {
      return t.length > 0;
    }).join('|');
    var regex = new RegExp(pattern, 'gi');

    return search ? text.replace(regex, (match) => `<strong>${match}</strong>`) : text;
  }

}

@Pipe({ name: 'searchOrigin' })
export class SearchOriginPipe implements PipeTransform {
  transform(text: string, search): string {    
    if(text == "artists"){
    	return "Artist";
    }else if(text == "users" || text == 'friends'){
    	return "Member";
    }else if(text == "Event"){
      return "Event";
    }else if(text == "genres"){
      return "Genre";
    }else if(text == "artmovements"){
      return "Artmovement";
    }else if(text == "schools"){
      return "School";
    }else if(text == "nationalities"){
      return "Nationality";
    }
    return text;
  }
}
