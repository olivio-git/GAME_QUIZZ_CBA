
export const dateFormat = (fechaOriginal) => { 
    const fecha = new Date(fechaOriginal); 
        const año = fecha.getFullYear();
        const mes = fecha.getMonth() + 1; 
        const dia = fecha.getDate();
        const hora = fecha.getHours();
        const minutos = fecha.getMinutes();
        const segundos = fecha.getSeconds(); 
        return `${dia}/${mes}/${año} ${hora}:${minutos}:${segundos}`;
};