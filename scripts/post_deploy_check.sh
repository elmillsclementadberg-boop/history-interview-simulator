#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "用法: $0 <BASE_URL>"
  echo "示例: $0 https://history-interview-simulator.onrender.com"
  exit 1
fi

BASE_URL="${1%/}"

check_http_ok() {
  local name="$1"
  local url="$2"
  local code
  code=$(curl -s -o /tmp/check_body.txt -w "%{http_code}" "$url")
  if [[ "$code" != "200" ]]; then
    echo "[FAIL] $name ($url) -> HTTP $code"
    echo "响应片段:"
    head -c 300 /tmp/check_body.txt || true
    echo
    exit 1
  fi
  echo "[PASS] $name ($url)"
}

check_api_health() {
  local url="$BASE_URL/api/health"
  local body
  body=$(curl -s "$url")
  echo "$body" | rg '"ok"\s*:\s*true' >/dev/null || {
    echo "[FAIL] health未返回 ok=true"
    echo "$body"
    exit 1
  }
  echo "$body" | rg '"backend"\s*:\s*"(memory|redis)"' >/dev/null || {
    echo "[FAIL] health未返回限流后端"
    echo "$body"
    exit 1
  }
  echo "[PASS] API 健康检查"
  echo "      $body"
}

check_chat_api() {
  local url="$BASE_URL/api/chat"
  local body code
  body='{"model":"llama-3.1-8b-instant","messages":[{"role":"user","content":"请回复：测试成功"}],"temperature":0}'
  code=$(curl -s -o /tmp/chat_body.txt -w "%{http_code}" -X POST "$url" \
    -H 'Content-Type: application/json' \
    --data "$body")

  if [[ "$code" != "200" ]]; then
    echo "[FAIL] /api/chat -> HTTP $code"
    echo "响应片段:"
    head -c 500 /tmp/chat_body.txt || true
    echo
    exit 1
  fi

  rg '"choices"' /tmp/chat_body.txt >/dev/null || {
    echo "[FAIL] /api/chat 响应中没有 choices"
    head -c 500 /tmp/chat_body.txt || true
    echo
    exit 1
  }

  echo "[PASS] API 对话可用"
}

check_http_ok "首页" "$BASE_URL/"
check_http_ok "隐私页" "$BASE_URL/privacy.html"
check_api_health
check_chat_api

echo ""
echo "全部通过：基础上线验收完成。"
echo "建议继续人工检查："
echo "1) 浏览器打开页面，测试语音录音->转写->发送"
echo "2) 连续快速点击发送，确认限流提示符合预期"
echo "3) 结束复试并下载PDF，确认报告导出正常"
