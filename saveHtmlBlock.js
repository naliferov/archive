
//     if (!t.id) return
//     if (!t.classList.contains('stored')) return

//     const data = { tag: t.tagName }
//     data.html = await x.p('getBlockHtml', { dom: t })
//     const attr = {}

//     for (let i = 0; i < t.attributes.length; i++) {
//       const at = t.attributes[i]
//       if (at.name === 'id') continue
//       if (at && at.value.trim()) attr[at.name] = at.value.trim()
//     }
//     if (Object.keys(attr).length > 0) {
//       data.attr = attr
//     }
//     await x.p('set', { id: t.id, v: data })