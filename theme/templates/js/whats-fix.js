const __ws_copy_selector = '.footer-copy, .copy-sole, .copy, .engloba-copy',
    __ws_whats_selector = '.whats-fixo, .whatsapp-fixo, .fixo-whatsapp, .container-contatos-flutuantes, .link-whats-web',
    __ws_politicas_selector = '.barra-politicas, .barra-politica, .barra-politica-cookies, .fundo-barra-politicas',
    __ws_politicas_closed_class = 'barra-politicas-close',
    __ws_btnok_classes = ['btn-ok', 'btn-cookies'],
    __ws_cookie_names = ['btn_ok'],
    __ws_mobile_only = false,
    max_width = 990;
const __ws_select = selector => document.querySelectorAll(selector),
    __ws_reset_whats_attrs = async () => __ws_select(__ws_whats_selector).forEach(w => {
        w.style.transition = '.4s';
        if(__ws_mobile_only)
            return w.style.bottom = undefined;
            
        let {offset: p_offset, element: politica} = __ws_politicas_max_height();
        if(typeof window['getCookie'] === 'function' && __ws_cookie_names.filter(getCookie).length > 0 && __ws_overlaps(politica, w) && p_offset)
            w.style.bottom = p_offset+'px';
    });

async function __ws_fix_whats_height() {
    let cur_width = Math.min(screen.width, window.innerWidth);
    if (cur_width > max_width)
        return __ws_reset_whats_attrs();

    let body = document.body,
        html = document.documentElement;
    let scroll = window.scrollY,
        documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight),
        window_height = Math.min(screen.height, window.innerHeight);

    documentHeight = documentHeight - window_height;

    let copy = __ws_select(__ws_copy_selector),
        whats = __ws_select(__ws_whats_selector),
        offset = 0,
        {offset: p_offset, element: politica} = __ws_politicas_max_height(),
        height_filter = _e => {
            let height = _e.getBoundingClientRect().height;
            if (height > offset)
                offset = height;
        };

    copy.forEach(height_filter);

    whats.forEach(w => {
        if (!w.style.transition)
            w.style.transition = '.4s';

        let s = getComputedStyle(w);
        let mb = parseInt(s.marginBottom), pb = parseInt(s.paddingBottom);
        let dist_offset = mb + pb;

        if(__ws_overlaps(w, politica, dist_offset) && p_offset)
            return w.style.bottom = p_offset+'px';
        
        w.style.bottom = scroll + offset + dist_offset >= documentHeight ? offset+'px' : '';
    });
}

function __ws_politicas_max_height() {
    let politicas = __ws_select(__ws_politicas_selector),
        offset = 0,
        element = null;

    politicas.forEach(p => {
        if(p.classList?.contains(__ws_politicas_closed_class))
            return;

        let {height} = p.getBoundingClientRect();
        if (height > offset)
            offset = height, element = p;
    });
    return {offset: offset, element: element};
}

function __ws_overlaps(el1, el2, offset = 0) {
    if(el1 === null || el1 === undefined || el2 === null || el2 === undefined)
        return false;

    let rect1 = el1.getBoundingClientRect(), rect2 = el2.getBoundingClientRect();
    return !(rect1.top + offset > rect2.bottom || rect1.right + offset < rect2.left || rect1.bottom + offset < rect2.top || rect1.left + offset > rect2.right);
}

window.addEventListener('load', () => __ws_fix_whats_height());
window.addEventListener('scroll', () => __ws_fix_whats_height());
window.addEventListener('click', e => Array.from(e.target?.classList)?.filter(c => __ws_btnok_classes.includes(c)) ? setTimeout(__ws_fix_whats_height, 100) : null);
