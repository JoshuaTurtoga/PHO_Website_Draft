"""
Re-parse all hospital-*.html files and generate a clean, correct SQL seed file.
Fixes:
  - UTF-8 encoding (curly quotes, em dashes, etc.)
  - Programs/Activities mapped to `hospital_programs` as grouped boxes
  - All fields correctly extracted and encoded
"""
import os, glob, json, re
from html import unescape
from bs4 import BeautifulSoup

def esc_sql(val):
    """Escape a string value for SQL single-quoted strings."""
    if not isinstance(val, str):
        return str(val) if val is not None else ''
    return val.replace("'", "''")

def parse_hospital_file(filepath):
    slug = os.path.basename(filepath).replace('hospital-', '').replace('.html', '')
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    soup = BeautifulSoup(html, 'html.parser')

    # ---- Hero ----
    hero_section = soup.select_one('.hospital-hero')
    hero_img = ''
    if hero_section and hero_section.get('style'):
        m = re.search(r"url\(['\"]?(.*?)['\"]?\)", hero_section.get('style'))
        if m: hero_img = m.group(1)
    hero_title = (soup.select_one('.hospital-hero-title') or {}).get_text(strip=True) if soup.select_one('.hospital-hero-title') else ''
    hero_subtitle = (soup.select_one('.hospital-hero-subtitle') or {}).get_text(strip=True) if soup.select_one('.hospital-hero-subtitle') else ''

    # ---- Overview ----
    wm = soup.select_one('.welcome-main')
    overview_title = wm.select_one('.section-title').get_text(strip=True) if wm and wm.select_one('.section-title') else ''
    quote = wm.select_one('.hospital-quote').get_text(strip=True) if wm and wm.select_one('.hospital-quote') else ''
    overview_body = wm.select_one('.welcome-text').get_text(strip=True) if wm and wm.select_one('.welcome-text') else ''
    offer_heading = wm.select_one('.offer-heading').get_text(strip=True) if wm and wm.select_one('.offer-heading') else ''
    offer_title   = wm.select_one('.offer-label').get_text(strip=True) if wm and wm.select_one('.offer-label') else ''
    offer_body    = wm.select_one('.offer-value').get_text(strip=True) if wm and wm.select_one('.offer-value') else ''

    # ---- Contact info ----
    phone = email1 = email2 = location = fb_url = fb_label = ''
    for ci in soup.select('.contact-item'):
        lbl_el = ci.select_one('.contact-label')
        if not lbl_el: continue
        lbl = lbl_el.get_text(strip=True).lower()
        if 'phone' in lbl:
            a = ci.select_one('a')
            if a: phone = a.get_text(strip=True)
        elif 'email' in lbl:
            links = ci.select('a')
            if len(links) > 0: email1 = links[0].get_text(strip=True)
            if len(links) > 1: email2 = links[1].get_text(strip=True)
        elif 'location' in lbl:
            spans = ci.select('span')
            if len(spans) > 1: location = spans[1].get_text(strip=True)
        elif 'facebook' in lbl:
            a = ci.select_one('a')
            if a:
                fb_url = a.get('href', '')
                fb_label = a.get_text(strip=True)

    # ---- Map ----
    map_embed = map_link = ''
    loc = soup.select_one('.hospital-location-section')
    if loc:
        iframe = loc.select_one('iframe')
        if iframe: map_embed = iframe.get('src', '')
        a = loc.select_one('a.btn-primary')
        if a: map_link = a.get('href', '')

    hospital = {
        'slug': slug,
        'hero_image_url': hero_img,
        'hero_title': hero_title,
        'hero_subtitle': hero_subtitle,
        'overview_title': overview_title,
        'overview_body': overview_body,
        'quote': quote,
        'offer_heading': offer_heading,
        'offer_title': offer_title,
        'offer_body': offer_body,
        'phone': phone,
        'email_primary': email1,
        'email_secondary': email2,
        'location_text': location,
        'facebook_url': fb_url,
        'facebook_label': fb_label,
        'map_embed_url': map_embed,
        'map_link_url': map_link,
    }

    # ---- Services ----
    services = []
    for i, card in enumerate(soup.select('.hospital-services-grid .service-detail-card')):
        t = card.select_one('.service-card-title')
        title = t.get_text(strip=True) if t else ''
        intro_el = card.select_one('.facility-desc')
        intro = intro_el.get_text(strip=True) if intro_el else ''

        items = []
        sl = card.select_one('.service-list')
        if sl:
            pending_title = None
            pending_items = []
            for child in sl.children:
                if not hasattr(child, 'get'):
                    continue
                classes = child.get('class', [])
                if 'service-list-item' in classes:
                    if pending_title is not None:
                        items.append({'title': pending_title, 'items': pending_items})
                        pending_title = None; pending_items = []
                    sp = child.select_one('span')
                    items.append(sp.get_text(strip=True) if sp else child.get_text(strip=True))
                elif 'service-sublist-title' in classes:
                    if pending_title is not None:
                        items.append({'title': pending_title, 'items': pending_items})
                    pending_title = child.get_text(strip=True)
                    pending_items = []
                elif 'service-sublist-scroll' in classes:
                    pending_items.extend([si.get_text(strip=True) for si in child.select('.service-sub-item')])
            if pending_title is not None:
                items.append({'title': pending_title, 'items': pending_items})

        services.append({'title': title, 'intro': intro, 'items': items, 'sort_order': i + 1})

    # ---- Programs (activity-card-box) ----
    programs = []
    for i, box in enumerate(soup.select('.activities-grid-layout .activity-card-box')):
        is_covid = 'covid' in box.get('class', [])
        h3 = box.select_one('h3')
        box_title = h3.get_text(separator=' ', strip=True) if h3 else ''
        # strip SVG text which BeautifulSoup sometimes includes
        if h3:
            for svg in h3.select('svg'):
                svg.decompose()
            box_title = h3.get_text(strip=True)
        list_items = [el.get_text(strip=True) for el in box.select('.activity-list-item span')]
        programs.append({
            'title': box_title,
            'body': json.dumps(list_items, ensure_ascii=False),
            'badge': '',
            'is_covid': is_covid,
            'sort_order': i + 1,
        })

    return hospital, services, programs


def generate_sql(all_data):
    lines = [
        '-- ============================================================',
        '-- Hospital content seed — generated from static HTML files',
        '-- Run this AFTER the initial pho_cms_setup.sql',
        '-- ============================================================',
        '',
    ]

    # Hospital field updates
    update_fields = [
        'hero_image_url','hero_title','hero_subtitle',
        'overview_title','overview_body','quote',
        'offer_heading','offer_title','offer_body',
        'phone','email_primary','email_secondary','location_text',
        'facebook_url','facebook_label','map_embed_url','map_link_url',
    ]
    for hospital, _, _ in all_data:
        sets = ', '.join(f"{f} = '{esc_sql(hospital[f])}'" for f in update_fields)
        lines.append(f"UPDATE public.hospitals SET {sets} WHERE slug = '{hospital['slug']}';")

    lines += [
        '',
        '-- Clear and re-seed services and programs',
        'DELETE FROM public.hospital_services;',
        'DELETE FROM public.hospital_programs;',
        '',
    ]

    # Services
    for hospital, services, _ in all_data:
        slug = hospital['slug']
        for s in services:
            items_json = json.dumps(s['items'], ensure_ascii=False)
            lines.append(
                f"INSERT INTO public.hospital_services (hospital_id, title, intro, items, sort_order)"
                f" SELECT id, '{esc_sql(s['title'])}', '{esc_sql(s['intro'])}', '{esc_sql(items_json)}'::jsonb, {s['sort_order']}"
                f" FROM public.hospitals WHERE slug = '{slug}';"
            )

    lines.append('')

    # Programs (stored as activity boxes — body is a JSON array of items)
    for hospital, _, programs in all_data:
        slug = hospital['slug']
        for p in programs:
            is_covid_sql = 'true' if p['is_covid'] else 'false'
            lines.append(
                f"INSERT INTO public.hospital_programs (hospital_id, title, body, badge, is_covid, sort_order)"
                f" SELECT id, '{esc_sql(p['title'])}', '{esc_sql(p['body'])}', '{esc_sql(p['badge'])}', {is_covid_sql}, {p['sort_order']}"
                f" FROM public.hospitals WHERE slug = '{slug}';"
            )

    return '\n'.join(lines)


if __name__ == '__main__':
    all_data = []
    for filepath in sorted(glob.glob('hospital-*.html')):
        print(f'Parsing {filepath}...')
        try:
            hospital, services, programs = parse_hospital_file(filepath)
            all_data.append((hospital, services, programs))
            print(f'  slug={hospital["slug"]}, services={len(services)}, programs={len(programs)}')
        except Exception as e:
            print(f'  ERROR: {e}')

    sql = generate_sql(all_data)
    with open('hospital_seed.sql', 'w', encoding='utf-8') as f:
        f.write(sql)
    print(f'\nWrote hospital_seed.sql ({len(sql)} bytes)')
